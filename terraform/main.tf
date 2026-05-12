resource "aws_security_group" "web_sg" {
  name = "web-sg"

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web" {
  ami           = "ami-0df4b2961410d4cff"
  instance_type = var.instance_type

  security_groups = [aws_security_group.web_sg.name]

  user_data = <<-EOF
              #!/bin/bash
              apt update -y
              apt install -y git curl

              curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
              apt install -y nodejs

              git clone -b main https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git /home/ubuntu/app

              cd /home/ubuntu/app/app

              npm install

              nohup npm start > app.log 2>&1 &
              EOF

  tags = {
    Name = "terraform-web-app"
  }
}
