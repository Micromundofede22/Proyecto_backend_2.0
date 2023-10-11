export const getLoginViews = (req, res) => {
    res.render('sessions/login')
}

export const getRegisterViews= (req, res) => {
    res.render('sessions/register')
}

export const getRestablecerViews =(req,res)=>{
    res.render("sessions/olvidarContra")
}