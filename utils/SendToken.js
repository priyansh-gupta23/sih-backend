exports.sendtoken = (buyer, statusCode, res) => {
    const token = buyer.getjwttoken();

    const options = {
        exipres: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    }
    res.status(statusCode).cookie("token", token, options)
        .json({ success: true, id: buyer._id, email: buyer.email, token })
    
    
}