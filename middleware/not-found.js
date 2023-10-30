 const notFound = (req, res) => res.status(404).send({
    msg:'not found',
    full_path:req.originalUrl
})

  module.exports = notFound
