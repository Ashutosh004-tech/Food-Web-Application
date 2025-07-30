const Item = require("./models/item.js");

module.exports.isLoggedIn = (req, res, next)=>{
if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("failuer","You must be logged in first");
    return res.redirect("/admin/login");
  }
  next();
}


module.exports.isUserLoggedIn = (req, res, next)=>{
  if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
      req.flash("failuer","You must be logged in first");
      return res.redirect("/user/login");
    }
    next();
  }

module.exports.saveRedirectUrl = (req,res,next)=>{
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req,res,next)=>{
  let { id } = req.params;
  let item = await Item.findById(id);
  if( !item.owner._id.equals(res.locals.crnUser._id)){
    req.flash("failuer", "You don't have permission");
    return res.redirect(`/items/${id}`);
  }
  next();
}