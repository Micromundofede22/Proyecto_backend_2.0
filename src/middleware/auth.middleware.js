
export const handlePolicies = policies => (req, res, next) => {
    const user = req.user.user || null;
    // console.log('handlePolicies: ', user)
    if (!policies.includes(user.role.toUpperCase())) return res.status(401).json({ status: "error", error: "Acceso denegado" });
    return next();
};
