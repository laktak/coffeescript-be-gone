
var path=require("path");
var coffee=require("coffee-script");

module.exports=
{
  activate: function(state)
  {
    var orgItemOpened=atom.workspace.itemOpened;
    atom.workspace.itemOpened=function(item)
    {
      var res=orgItemOpened.call(this, item);
      var ext=path.extname(item.getUri()).toLowerCase();
      if (ext===".coffee")
        item.setText(convert(item.getText()));
      return res;
    };
  },
  configDefaults:
  {
    addBackTicks: true,
    keepOriginalSourceAtBottom: false,
  },
};

function convert(text)
{
  if (text.length>1 && text[0]==="`")
    return text; // assume it has been converted before

  var orgText=text;
  try
  {
    text=coffee.compile(text, { bare: true });
    if (atom.config.get('coffeescript-be-gone.addBackTicks'))
      text="`\n"+text+"\n`";
    if (atom.config.get('coffeescript-be-gone.keepOriginalSourceAtBottom'))
      text+="\n\n# original coffeescript:\n"+orgText.replace(/^(.+)$/gm, "# $1");
  }
  catch(err)
  {
    text="cs compile failed: "+err.toString()+"\n###\n\n"+orgText;
  }
  return text;
}
