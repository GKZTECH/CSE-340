const reviewModel = require("../models/reviewModel")

async function postReview(req, res) {
  const { review_text, review_rating, inv_id } = req.body
  const account = res.locals.account

  if (!account) {
    return res.redirect("/account/login")
  }

  if (!review_text || review_text.length < 5) {
    req.session.messages = { error: "Review must be at least 5 characters." }
    return res.redirect(`/inventory/detail/${inv_id}`)
  }

  try {
    await reviewModel.addReview(
      review_text,
      parseInt(review_rating),
      inv_id,
      account.account_id
    )
    req.session.messages = { success: "Review added successfully." }
    res.redirect(`/inventory/detail/${inv_id}`)
  } catch (err) {
    console.error(err)
    req.session.messages = { error: "Failed to add review." }
    res.redirect(`/inventory/detail/${inv_id}`)
  }
}

async function removeReview(req, res) {
  const { review_id, inv_id } = req.body

  if (res.locals.account.account_type !== "Admin") {
    return res.redirect("/account/login")
  }

  await reviewModel.deleteReview(review_id)
  res.redirect(`/inventory/detail/${inv_id}`)
}

module.exports = { postReview, removeReview }
