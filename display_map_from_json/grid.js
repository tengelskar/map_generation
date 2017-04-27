/*Created by Maren and Tengel*/
var viewpoint_x = 0;
var viewpoint_y = 0;
var viewpoint_r = 0;
var translate_x = 0;
var translate_y = 0;
var grid_size = 0;
//call resize game screen once
function main() {
  resize_game_screen()
};
//set the ranslation variables,
//which are subtracted from the x and y coordinates before drawing
function set_translation() {
  translate_x = viewpoint_x - viewpoint_r;
  translate_y = viewpoint_y - viewpoint_r;
}
//set the viewpoint parameters inside js from json file
function set_viewpoint_parameters() {
  viewpoint_x = window.game_objects["viewpoint"]["x"];
  viewpoint_y = window.game_objects["viewpoint"]["y"];
  viewpoint_r = window.game_objects["viewpoint"]["radius"];
  grid_size = 1 + (2 * viewpoint_r);
  console.log(grid_size, viewpoint_r)
  set_translation();
};
//draw a tile using world coordinates
function draw_tile(ctx, x_pos, y_pos, colorcode) {
    var tile_width = (ctx.canvas.width / grid_size);
    var tile_height = tile_width;
    var offset_x = (x_pos - translate_x) * tile_width;
    var offset_y = (y_pos - translate_y) * tile_height;
    ctx.fillStyle = colorcode;
    ctx.beginPath()
    ctx.fillRect(offset_x, offset_y, tile_width, tile_height);
    ctx.rect(offset_x, offset_y, tile_width, tile_height);
    ctx.stroke();
};

function get_unit(units, tile_id) {
    //write code that checks whether the units array has a unit with the given tile id
    var unit = null;
    if(units[tile_id]){
        unit = units[tile_id];
    }
    return unit;
};
// Return the owner of the unit if present.
function get_player(players, player_id) {
    var player = null;
    if(players[player_id]) {
        player = players[player_id];
    }
    return player;
}
function draw_unit(ctx, x_pos, y_pos, player_color) {
    var tile_width = (ctx.canvas.width / grid_size);
    var tile_height = tile_width;
    var offset_x = (x_pos - translate_x) * tile_width;
    var offset_y = (y_pos - translate_y) * tile_height;

    var value = parseInt(player_color, 10);
    var unit_color = Number(value).toString(16).toUpperCase();

    ctx.fillStyle = "#"+unit_color; // tiny lil' hack.

    ctx.beginPath();
    ctx.arc((offset_x+(tile_width/2)), (offset_y+(tile_height/2)), (tile_width/4), 50, 0, 2*Math.PI);
    ctx.fill();

    //ctx.stroke();
    //ctx.fillRect(offset_x, offset_y, tile_width, tile_height);
};
//call draw tile for each screen tile at correct position
function draw_tiles(ctx) {
    if (game_objects == null){
        console.log("No Game objects!")
        return;
    };

    console.log("game_objects");
    console.log(window.game_objects);
    var tiles = window.game_objects["tiles"];
    console.log("tiles.type");
    console.log(tiles.type);
    //hash the tiletypes by value
    var tiletypes = window.game_objects["tiletypes"];
    console.log("tiletypes");
    console.log(tiletypes);
    mapped_tiletypes = {};
    console.log("mapping tiletypes");
    for (var i = 0, l = tiletypes.length; i < l; i++){
        console.log(tiletypes[i]);
        mapped_tiletypes[tiletypes[i].id] = tiletypes[i];
    }
    console.log("mapped tiletypes:");
    console.log(mapped_tiletypes);
    console.log("end mapped tiletypes");
    var units = window.game_objects["units"];
    var mapped_units = {};

    for (var i = 0, l = units.length; i < l; i++) {
        mapped_units[units[i].tile_id] = units[i];
    }
    console.log("mapped units here");
    console.log(mapped_units);
    console.log("end mapped units");

    var players = window.game_objects["players"];

    var i = 0;
    //iterate over tiles array
    for (i; i < tiles.length; i++) {
        //for each tile, draw it
        tile = tiles[i];
        tilecolor_int = mapped_tiletypes[tile["tiletype_id"]]["color"];
        tilecolor = "#"+Number(tilecolor_int).toString(16).toUpperCase();
        draw_tile(ctx, tile["x"], tile["y"], tilecolor);
        //check whether a unit is placed on the tile

        unit = get_unit(mapped_units, tile.id);
        if (unit != null) {
            // Find owner of unit to use user specified color.
            player = get_player(players, unit.player_id);
            console.log("found unit with same id!");
            draw_unit(ctx, tile["x"], tile["y"], player.color);
        }
    }
};



function draw_game_screen(ctx) {
  //objective = draw game screen with tiles and units
  //find out how many tiles in
  set_viewpoint_parameters();

  draw_tiles(ctx);
  ctx.stroke();
  //  draw_units(ctx);
};

function resize_game_screen() {
  var ctx = document.getElementById('game-screen').getContext('2d');
  console.log("screen resize should happen now!!");
  ctx.canvas.width = 0.50 * window.innerWidth;
  ctx.canvas.height = ctx.canvas.width;
  draw_game_screen(ctx)
};



$(document).ready(main);
