
export const handlePolicies = policies => (req, res, next) => {
    const user = req.user.user || null
    // console.log('handlePolicies: ', user)
    if (policies.includes('ADMIN' || 'PREMIUM')) {
        if (user.role != 'admin' && user.role != "premium") {
            return res.status(401).json({ status: "error", error: 'Acceso denegado. Necesita ser ADMIN o PREMIUM' })
        }
    }


    if (policies.includes('USER')) {
        if (user.role !== 'user') {
            return res.status(401).json({ status: "error", error: 'Acceso denegado. Necesita cuenta de user' })
        }
    }

return next()
}
