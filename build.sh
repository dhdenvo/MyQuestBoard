sudo docker rm $(sudo docker ps -aq) -f
sudo docker rmi $(sudo docker images -q) -f
sudo docker build -t quest .
sudo docker run -p 80:8080 -v "/home/dhdenvo/Pictures/QuestBoardImages:/server-app/savedImages" quest
