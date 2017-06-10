gr.registerComponent("EffekseerRenderer",{
  effects:{},
  attributes:{
  },
  $awake:function(){
    this._gl = this.companion.get("gl");
    this._canvas = this.companion.get("canvasElement");
    effekseer.init(this._gl);
  },
  $mount:function(){
  },
  $update:function(){
  },
  $render:function(args){
    this._gl.viewport(args.viewport.Left, this._canvas.height - args.viewport.Bottom, args.viewport.Width, args.viewport.Height);
    
    effekseer.update();
    effekseer.setProjectionMatrix(args.camera.ProjectionMatrix.rawElements);
    effekseer.setCameraMatrix(args.camera.ViewMatrix.rawElements);
    effekseer.draw();
  }
});
gr.registerNode("render-effekseer",["EffekseerRenderer"],{},"");

gr.registerComponent("EffekseerEmitter",{
  attributes:{
    src: {converter: "String", default: null},
  },
  $mount:function() {
    var src = this.getAttribute("src");
    if (src) {
      this.effect = effekseer.loadEffect(src, 
        function(){
          this.handle = effekseer.play(this.effect);
        }.bind(this)
      );
    }
  },
  $update:function() {
    if("handle" in this && this.handle != null)
    {
      var transform = this.node.getComponent("Transform");

      var pos = transform.getAttribute("position");
      this.handle.setLocation(pos.X, pos.Y, pos.Z);

      const rot = transform.getAttribute("rotation").eularAngles;
      this.handle.setRotation(rot.X,rot.Y,rot.Z);

      const s = transform.getAttribute("scale");
      this.handle.setScale(s.X,s.Y,s.Z);

    }
  },
});
gr.registerNode("efk",["EffekseerEmitter"],{},"object");