import { Router } from "express";
import { addSale,getSales, getTotalProfitValueLast30Days, getTotalProfitValueAllTime ,getDailyTotalSalesValuePast30Days, getTotalProfitValueOneDay, getTotalSalesValueAllTime, getTotalSalesValueLast30Days, getTotalSalesValueOneDay, getDailyProfitLast30Days, getDailyTotalCostValuePast30Days, getTotalCostValueAllTime } from "../controllers/sales.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/add-sale').post(verifyJWT, addSale)
router.route('/get-sale').get(verifyJWT, getSales)
router.route('/get-total-oneday-sale').get(verifyJWT, getTotalSalesValueOneDay)
router.route('/get-total-last30Day-sale').get(verifyJWT, getTotalSalesValueLast30Days)
router.route('/get-total-allTime-sale').get(verifyJWT, getTotalSalesValueAllTime)
router.route('/get-total-allTime-profit').get(verifyJWT, getTotalProfitValueAllTime)
router.route('/get-total-allTime-cost').get(verifyJWT, getTotalCostValueAllTime)
router.route('/get-total-one-profit').get(verifyJWT, getTotalProfitValueOneDay)
router.route('/get-total-last30Day-profit').get(verifyJWT, getTotalProfitValueLast30Days)
router.route('/get-daily-sale-30Day').get(verifyJWT, getDailyTotalSalesValuePast30Days)
router.route('/get-daily-profit-30Day').get(verifyJWT, getDailyProfitLast30Days)
router.route('/get-daily-cost-30Day').get(verifyJWT, getDailyTotalCostValuePast30Days)

export default router