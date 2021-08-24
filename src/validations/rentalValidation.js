import {body} from 'express-validator';

const updateRentalFieldRules = () => [
    body('rental_id')
    .notEmpty()
    .withMessage('Rental_id is empty')
    .bail()
    .isNumeric()
    .withMessage('rental_id is invalid'),
    body('status')
    .notEmpty()
    .withMessage('Status cant empty')
    .bail()
    .isIn(['pending', 'approved', 'canceled', 'returned', 'notpaid'])
    .withMessage('wrong status')
]

export default {
    updateRentalFieldRules
}