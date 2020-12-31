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
        case 'USER_EXIST' :
        code = 500;
        message = 'Cant Register More Than 1 Tournament'
        break;
        case 'REQUIRED': 
        code = 500;
        message = 'Data Invalid,Fill a valid data!!'
        break;
        case 'OLDPASSWORD_WRONG': 
        code = 500;
        message = 'fill a valid old password'
        break;
        case 'ADDRESS_REQUIRED' :
        code = 500;
        message = 'Cant Create Committe, fill your address district!!'
        break;
        case 'PASSWORD_LESS': 
        code = 500;
        message = 'Min length password 6'
        break;
        case 'PHONE_EXIST': 
        code = 500;
        message = 'Number Phone Already Exist'
        break;
        case 'ADDRESS_EXIST':
        code = 500;
        message = 'Address for headman already exist!'
        break;
        case 'USERNAME_EXIST': 
        code = 500;
        message = 'Username Already Exist'
        break;
        case 'INCORRECT_LOGIN': 
        code = 500;
        message = 'Incorrect Email or Password'
        break;
        case 'USER_NOT_FOUND':
        code = 404;
        message = 'User Not Found!! You can SignUp'
        break;
        case 'NOT_ACCESS':
        code = 500;
        message = 'You dont have access!!'
        break;
        case 'MISSING_TOKEN':
        code = 404;
        message = 'Token is required'
        break;
        case 'URL_EXIST' :
        code = 500;
        message = 'Url Already Exist'
        break;
        case 'ONLY_ONE_GAME' :
        code = 500;
        message = 'Your tournament game was already exist for other tournament'
        break;
        case 'INCORRECT_TOKEN':
        code = 404;
        message = 'Token Invalid'
        break;
        case 'TOURNAMENT_EXIST':
        code = 500;
        message = 'Tournament Already Exist'
        break;
        case 'TOURNAMENT_FAILED':
        code = 404;
        message = 'Tournament Not found'
        break;
        case 'TOURNAMENT_FULL' : 
        code = 500;
        message = 'Sorry Tournament full you can find other tournament'
        break;
        case 'TOURNAMENT_FINISH' : 
        code = 500;
        message = 'Tournament Already Finish'
        break
        case 'TOURNAMENT_INCORRECT' : 
        code = 500;
        message = 'Tournament Participant must 4-100'
        break
        case 'MATCH_FAILED' :
        code = 500;
        message = 'Match Not Found'
        break;
        case 'GAME_EXIST' : 
        code = 500;
        message = 'Game already exist'
        break;
        case 'AGE_LESS' :
        code = 500;
        message = 'Cant Register, Your Age Not Valid for this Tournament'
        break;
        case 'GAME_FAILED' : 
        code = 404
        message = 'Game Not Found'
        break;
        case 'ONLY_USER' :
        code = 500
        message = 'Only user can participant tournament'
        break;
        case 'USER_WINNER':
        code = 500
        message = 'User already winner on this stage'
        break;
        case 'GROUP_REQUIRED' :
        code = 500;
        message = 'Fill User / Group , Max User in group is 10'
        break;
        case  'ERROR' :
        code = 500;
        message = 'Internal server error';
        break;
        default:
        code = 500;
        message = 'Internal server error';
        break;
    }
    res.status(code).json({success : false, message})
}