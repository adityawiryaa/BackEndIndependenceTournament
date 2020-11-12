module.exports = (err,req,res,next) => {
    let code;
    let name = err.name
    let message;

    console.log(err)
    switch(name) {
        case 'ALREADY_EXIST': 
        code = 500;
        message = 'User Already Exist'
        break;
        case 'INCORRECT_LOGIN': 
        code = 500;
        message = 'Incorrect Email or Password'
        break;
        case 'USER_NOT_FOUND':
        code = 404;
        message = 'User Not Found!!'
        break;
        case 'NOT_ACCESS':
        code = 500;
        message = 'You dont have access!!'
        break;
        case 'MISSING_TOKEN':
        code = 404;
        message = 'Token is required'
        break;
        case 'INCORRECT_TOKEN':
        code = 404;
        message = 'Token Invalid'
        break;
        

    }
    res.status(code).json({success : false,data : message})
}