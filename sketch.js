var trex,trex_running,edges,ground,groundImage,cloudImage,clouds,obstacles,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6,score,obstacleGroup,cloudGroup,gameState,trex_collided,gameOver,restart,gameOverImg,restartImg,jumpSound,dieSound,checkPointSound;

function preload(){
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  
  groundImage=loadImage("ground2.png");
  
  cloudImage=loadImage("cloud.png");
  
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");
  
  trex_collided=loadAnimation("trex_collided.png");
  
  gameOverImg=loadImage("gameOver.png");
  
  restartImg=loadImage("restart.png");
  
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkPointSound=loadSound("checkPoint.mp3");
}


function setup() {
  
  createCanvas(600, 200);
  
  //create sprite for trex
  trex=createSprite(50,150,10,10); 
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale=0.5;
  
  //Create sprite for ground
  ground=createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x=ground.width/2;

 
  //Create invisible ground
  invisibleGround=createSprite(200,190,400,10);
  invisibleGround.visible=false;
  
  //Create game over sprite
  gameOver=createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.5;
  
  //Create restart sprite
  restart=createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale=0.5;
  
  edges=createEdgeSprites();
  
  //Create obstacle and cloud groups
  obstacleGroup=new Group();
  cloudGroup=new Group();
  
  gameState="PLAY";
  
  score=0;
  
  //Reduce collision radius of Trex
  trex.setCollider("circle",0,0,40);
  
  
  
}

function draw() {
  
  background(180);
 
  
  if(gameState==="PLAY"){
    
    
     gameOver.visible=false;
     restart.visible=false;
    
     text("Score:"+score,450,50);
     score=score+(Math.round(frameRate()/60));
    
     ground.velocityX=-(4+score/100);
    
     //To make an illusion of infinite screen
    if (ground.x<0){
       ground.x=ground.width/2;
    }
    
    //Make Trex Jump
    if(keyDown("space") && trex.isTouching(ground)){
    //To prevent jumping of trex mid-air
      trex.velocityY=-10;
      jumpSound.play();
  } 
  
   //Make trex fall back to ground after space key is    released 
   trex.velocityY = trex.velocityY + 0.6 ;
    
  //Spawn the clouds
  spawnclouds();
  
  //Spawn obstacles
  spawnobstacles();
  
  //Check if trex is touching any obstacle
  if(obstacleGroup.isTouching(trex)){
    gameState="END";
    dieSound.play();
    
  }
  //Play check point sound  
  if(score>0 && score%100===0){
      checkPointSound.play();
    }
 
  }
  else if(gameState==="END"){
    
    ground.velocityX=0;
    trex.changeAnimation("collided",trex_collided);
    trex.velocityY=0;
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    gameOver.visible=true;
    restart.visible=true;
     if(mousePressedOver(restart)){
        reset();
  }
    
  }
  
 
  //To make trex stay on ground
  trex.collide(invisibleGround);
  
 
  drawSprites();
  
  
}
function reset(){
  
  gameState="PLAY";
  gameOver.visible=false;
  restart.visible=false;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  score=0;
  trex.changeAnimation("running",trex_running);
}

function spawnclouds(){
  if(frameCount%60===0){
  clouds=createSprite(600,100,40,10);
    
  clouds.addImage(cloudImage);  
  //clouds.y=Math.round(random(10,60));
  clouds.scale=0.4;
  clouds.velocityX=-3;
    
   clouds.lifetime=200; 
   
    
    console.log(clouds.depth);
  //Adjust the depth
    clouds.depth=trex.depth;
    trex.depth=trex.depth+1;
  
  //Add clouds to group
  cloudGroup.add(clouds);
  }
}

function spawnobstacles(){
  
  if(frameCount%60==0){
    obstacles=createSprite(600,165,10,40);
    obstacles.velocityX=-(4+score/100);
    
    //Generate random obstacles
    var rand=Math.round(random(1,6));
    switch(rand){
      case 1:obstacles.addImage(obstacle1);
             break;
      case 2:obstacles.addImage(obstacle2);
             break;
      case 3:obstacles.addImage(obstacle3);
             break;
      case 4:obstacles.addImage(obstacle4);
             break;
      case 5:obstacles.addImage(obstacle5);
             break;
      case 6:obstacles.addImage(obstacle6);
             break;
             default:break;
             
    
    }
    obstacles.scale=0.5;
    obstacles.lifetime=200;
    
    //Add each obstacles to group
    obstacleGroup.add(obstacles);
  }
}