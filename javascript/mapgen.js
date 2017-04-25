




function generate_2D_arr(width, height){
  var x, y;
  arr = new Array(width);
  for (x = 0; x<width; x++){
    arr[x] = new Array(height);
  }
  return arr
}
function random_noise(width, height){
  var x, y;
  var arr = generate_2D_arr(width, height);
  for (x = 0; x<width;x++){
    for (y=0;y<height;y++){
      arr[x][y] = Math.random();
    }
  }
  return arr;
}
function random_noise_lower_granularity(width, height, granularity){
  var low_q_width = Math.floor(width/granularity);
  var low_q_height= Math.floor(height/granularity)
  var low_q_map = random_noise(low_q_width, low_q_height);
  var arr = generate_2D_arr(width, height);
  for (x = 0; x<width; x++){
    lqx = (x/width)*low_q_width;
    lqx_i = Math.floor(lqx);
    for (y=0;y<height;y++){
      lqy = (y/height)*low_q_height;
      lqy_i = Math.floor(lqy);
      arr[x][y] = correct_val(low_q_map[lqx_i][lqy_i]);
    }
  }
  return arr;
}
function correct_val(val){
  if (val > 0.99){
    return 0.99;
  }
  if (val < 0.01){
    return 0.01;
  }
  return val;
}
//damping is a number between 0...1, and
function combine_maps(map1, map2, width, height, damping){
  var arr = generate_2D_arr(width, height);
  var x,y;
  for (x=0;x<width;x++){
    for(y=0;y<height;y++){
      h1 = map1[x][y];
      h2 = map2[x][y];
      new_h = ((1-damping)*h1)+(damping*h2)

      arr[x][y]=correct_val(new_h)

    }
  }
  return arr;
}

function convert_values(old_map, width, height, multiplier){
  var x, y;
  var arr = generate_2D_arr(width, height);
  for (x=0; x<width; x++){
    for(y=0; y<height; y++){
      arr[x][y] = Math.floor((old_map[x][y]*multiplier));
    }
  }
  return arr;
}

function calc_greytone(val){
  if(val >255){val = 255.0;}
  if(val <0){val = 0.0;}
  number_as_string = Math.floor(val).toString(16).toUpperCase();
  return   "#"+number_as_string+number_as_string+number_as_string;
}

function display_map(canvasId, map, width, height){
  console.log(map);
  ctx = document.getElementById(canvasId).getContext("2d");
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  var x,y;
  for (x = 0; x<width;x++){
    for (y=0;y<height;y++){
      ctx.fillStyle = calc_greytone(map[x][y]);
      ctx.fillRect(x,y,1,1);
    }
  }
  ctx.stroke();

}
var WATER_LEVEL = 0.3*255;
var DESERT_LEVEL = 0.75*255;
var GRASS_LEVEL = 0.60*255;
var MOUNTAIN_LEVEL = 1.0*255;
var water_color = "#0000FF"
var desert_color = "#F0E68C"
var grass_color = "#00FF00"
var mountain_color = "#808080"
function lookup_color(num){
  if (num < WATER_LEVEL){
    return water_color;
  }
  if (num<GRASS_LEVEL){
    return grass_color;
  }
  if (num < DESERT_LEVEL){
    return desert_color;
  }
  if (num < GRASS_LEVEL){
    return grass_color;
  }
  return mountain_color;
}

function colorize_map(canvasId, map, width, height){
  console.log(map);
  ctx = document.getElementById(canvasId).getContext("2d");
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  var x,y;
  for (x = 0; x<width;x++){
    for (y=0;y<height;y++){
      ctx.fillStyle = lookup_color(map[x][y]);
      ctx.fillRect(x,y,1,1);
    }
  }
  ctx.stroke();

}

function main(){
  var width = 512;
  var height = 512;
  //generate low res noise
  noise1 = random_noise_lower_granularity(width, height,16);
  //generate noise of 2 times the frequency
  noise2 = random_noise_lower_granularity(width, height, 8);
  //generate noise of 4 times the frequency
  noise3 = random_noise_lower_granularity(width, height, 4);
  //generate noise of 8 times frequency
  noise4 = random_noise_lower_granularity(width, height, 2);


  //combine the noise of noise1 and noise2
  combined_noise1 = combine_maps(noise1, noise2, width, height, 0.4);
  //combine combined_noise 1 with noise3
  combined_noise2 = combine_maps(combined_noise1, noise3, width, height, 0.2);
  combined_noise3 = combine_maps(combined_noise2, noise4, width, height, 0.1);

  map1 = convert_values(noise1, width, height, 255);
  map2 = convert_values(noise2, width, height, 255);
  map3 = convert_values(combined_noise1, width, height, 255);
  map4 = convert_values(combined_noise2, width, height, 255);
  map5 = convert_values(combined_noise3, width, height, 255);
  noise4_map = convert_values(noise4, width, height, 255);
  display_map("canvas", map1, width, height);
  display_map("canvas2", map2, width, height)
  display_map("canvas3", map3, width, height);
  display_map("canvas4", map4, width, height);
  display_map("canvas5", map5, width, height);
  colorize_map("canvas6",map5, width, height);
  colorize_map("canvas7", noise4_map, width, height, 255);
}

window.onload = function(){
  main();
}
