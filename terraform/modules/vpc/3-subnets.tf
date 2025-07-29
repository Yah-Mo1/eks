resource "aws_subnet" "private" {
    count = length(var.azs)
    vpc_id = aws_vpc.this.id
    cidr_block = var.private_subnets_cidr_blocks[count.index]
    availability_zone = var.azs[count.index]
    tags = merge(var.private_subnets_tags, {
        Name = "${var.env}-private-${var.azs[count.index]}"
    })
}

resource "aws_subnet" "public" {
    count = length(var.azs)
    vpc_id = aws_vpc.this.id
    cidr_block = var.public_subnets_cidr_blocks[count.index]
    availability_zone = var.azs[count.index]
    map_public_ip_on_launch = true
    tags = merge(var.public_subnets_tags, {
        Name = "${var.env}-public-${var.azs[count.index]}"
    })
}