server: system-update git-pull docker

system-update:
	sudo apt update
	sudo apt upgrade -y
# sudo apt dist-upgrade
	sudo apt autoremove
	sudo apt autoclean

git-pull:
	git pull

docker:
	sudo docker compose up --detach --build
	sudo docker system prune --force

