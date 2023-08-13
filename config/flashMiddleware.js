module.exports.setFlash = async(req,res, next)=>{
    //setting up the flash for ejs
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    }
    next();
}