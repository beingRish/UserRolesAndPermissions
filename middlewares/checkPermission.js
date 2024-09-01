

const checkPermission = async(req, res, next) => {

    try {

        // console.log(req.user);

        if(req.user.role != 1){ // if user not admin

            return res.status(400).json({
                success: false,
                msg: 'We will work on next lecture!'
            });

        }

        return next();

    } catch(error) {
        return res.status(400).json({
            success: false,
            msg: 'Something went wrong!'
        })
    }
}

module.exports = checkPermission;