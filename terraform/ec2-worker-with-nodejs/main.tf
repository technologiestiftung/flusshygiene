# Create a new instance of the latest Ubuntu 14.04 on an
# t2.micro node with an AWS Tag naming it "HelloWorld"
provider "aws" {
  region = "${var.region}"
  profile = "${var.profile}"
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-trusty-14.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_security_group" "public-group" {
   name        = "ec2-worker"
  description = "controls access to the ec2 worker"
    vpc_id      = "${var.vpc_id}"
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = -1
    to_port = -1
    protocol = "icmp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks =  ["0.0.0.0/0"]
  }
  tags = {
    Name = "Public Security Group"
  }
  egress{
    from_port = 0
    to_port =0
    protocol = -1
    cidr_blocks =  ["0.0.0.0/0"]
  }
}

resource "aws_instance" "worker" {
  ami           = "${data.aws_ami.ubuntu.id}"
  instance_type = "t2.micro"
  vpc_security_group_ids = ["${var.security_group}", "${aws_security_group.public-group.id}"]
  subnet_id = "${var.subnet_id}"
  key_name = "${var.key_name}"
  tags = {
    name = "postgres-api-populatedb"
    project = "flusshygiene"
    type =  "tf-worker"

  }


  provisioner "remote-exec" {
  # might be needed to have the connection defined here
  connection {
       type = "ssh"
       host = "${aws_instance.worker.public_dns}"
       private_key = "${file("${var.key_file_path}")}"
       port = 22
       user = "ubuntu"
   }
    inline = [

      "echo 'set number \n set linebreak \n set showbreak=+++  \n set textwidth=100 \n set showmatch \n set visualbell \n set hlsearch \n set smartcase \n set ignorecase \n set incsearch \n set autoindent \n set expandtab \n set shiftwidth=2 \n set smartindent \n set smarttab \n set softtabstop=2 \n' > ~/.vimrc",
      "sudo apt-get update -y",
      "curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -",
      "sudo apt install git nodejs tmux zsh -y",
      "cd /home/ubuntu",
      "git clone https://github.com/technologiestiftung/flusshygiene-postgres-api.git ./pgapi",
      "cd ./pgapi",
      "npm ci",
      "npm run build"

    ]
  }
}
