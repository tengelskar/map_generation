




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
//damping is a number between 0...1
function combine_maps(map1, map2, width, height, damping){
  var arr = generate_2D_arr(width, height);
  var x,y;
  for (x=0;x<width;x++){
    for(y=0;y<height;y++){
      h1 = map1[x][y];
      h2 = map2[x][y];
      av_h = (h1+h2)/2;
      if(av_h < h1){
        r = h1 - ((h1-av_h)*damping);
        arr[x][y] = correct_val(r);
      }
      else{
        r = h1 + ((h1-av_h)*damping);
        arr[x][y] = correct_val(r);
      }

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
  if(val >255){val = 255;}
  if(val <0){val = 0;}
  number_as_string = Math.floor(val).toString(16).toUpperCase();
  return   "#"+number_as_string+number_as_string+number_as_string;
}

function display_map(ctx, map, width, height){
  console.log(map);
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  var x,y;
  for (x = 0; x<width;x++){
    for (y=0;y<height;y++){
      ctx.fillStyle = calc_greytone(map[x][y])
      ctx.fillRect(x,y,1,1);
    }
  }
  ctx.stroke();

}



function main(){
  var canvas = document.getElementById("canvas");
  console.log(canvas);
  var ctx = canvas.getContext('2d');
  var width = 511;
  var height = 511;
  noise = random_noise_lower_granularity(width, height,16);
  map = convert_values(noise, width, height, 255);
  display_map(ctx, map, width, height);

  noise2 = random_noise_lower_granularity(width, height, 8);
  combined_noise = combine_maps(noise, noise2, width, height, 0.4);
  map3 = convert_values(combined_noise, width, height, 255);
  display_map(document.getElementById("canvas2").getContext("2d"), map3, width, height);


  noise3 = random_noise_lower_granularity(width, height, 4);
  combined_noise2 = combine_maps(combined_noise, noise3, width, height, 0.07);
  map4 = convert_values(combined_noise2, width, height, 255);
  display_map(document.getElementById("canvas3").getContext("2d"), map4, width, height);

  noise4 = random_noise_lower_granularity(width, height, 2);
  combined_noise3 = combine_maps(combined_noise2, noise4, width, height, 0.03);
  map5  = convert_values(combined_noise3, width, height, 255);
  display_map(document.getElementById("canvas4").getContext("2d"), map5, width, height);
}

window.onload = function(){
  main();
}
