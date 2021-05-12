const axios = require('axios')

exports.getBusinessNews = async (req, res) => {
    const { data } = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=${process.env.NEWS_API}`)
    res.status(200).json(data)
}

exports.getHealthNews = async (req, res) => {
    const { data } = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&category=health&apiKey=${process.env.NEWS_API}`)
    res.status(200).json(data)
}

exports.getScienceNews = async (req, res) => {
    const { data } = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&category=science&apiKey=${process.env.NEWS_API}`)
    res.status(200).json(data)
}

exports.getSportsNews = async (req, res) => {
    const { data } = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&category=sports&apiKey=${process.env.NEWS_API}`)
    res.status(200).json(data)
}