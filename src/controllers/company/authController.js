const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const Company = require('../../models/Company');

//@desc         employer login
//@route        GET /api/employer/auth/login
//@access       PUBLIC
const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	let company = await Company.findOne({ email }).select('+password');
	if (!company) {
		return next(new AppError('Email is not registered', 404));
	}
	const isMatch = await company.comparePassword(password);
	if (!isMatch) {
		return next(new AppError('Email or password is incorrect', 401));
	}
	company = await Company.populate(company, { path: 'industries' });
	res.status(200).json({
		message: 'Login sucessfully',
		data: company,
		accessToken: company.generateToken(),
	});
});

//@desc         employer register
//@route        GET /api/employer/auth/register
//@access       PUBLIC
const register = catchAsync(async (req, res, next) => {
	const { email, password, confirmPassword } = req.body;

	if (password !== confirmPassword) {
		return next(
			new AppError("Password and confirm password doesn't match", 400)
		);
	}
	const company = await Company.findOne({ email });
	if (company) {
		return next(new AppError('Email is already registered', 404));
	}

	const newCompany = await Company.create(req.body);
	newCompany.password = undefined;

	res.status(200).json({
		message: 'Register sucessfully',
		data: newCompany,
		accessToken: newCompany.generateToken(),
	});
});

//@desc         employer register
//@route        GET /api/employer/auth/register
//@access       PUBLIC
const verifyAccessToken = catchAsync(async (req, res, next) => {
	res.status(200).json({
		message: 'User is logged in',
		data: req.user,
	});
});

const updateCompany = catchAsync(async (req, res, next) => {
	const { idCompany } = req.params;

	const updatedCompany = await Company.findByIdAndUpdate(
		idCompany,
		req.body,
		{ new: true, runValidators: true }
	);

	if (!updatedCompany) {
		return next(new AppError('Not found the company', 404));
	}
	res.status(200).json({
		message: 'Update successfully',
		data: updatedCompany,
	});
});

//@desc         employer register
//@route        GET /api/employer/auth/register
//@access       PUBLIC
const updatePassword = catchAsync(async (req, res, next) => {
	const { password, newPassword } = req.body;
	const { idUser } = req.params;

	const company = await Company.findOne({ _id: idUser }).select('password');

	const isMatch = await company.comparePassword(password);
	if (!isMatch) {
		return next(new AppError('Password is not correct', 401));
	}

	const newCompany = await Company.findByIdAndUpdate(
		idUser,
		{ password: newPassword },
		{ new: true, runValidators: true }
	);
	newCompany.password = undefined;

	res.status(200).json({
		message: ' sucessfully',
		data: newCompany,
		accessToken: newCompany.generateToken(),
	});
});

module.exports = {
	login,
	register,
	verifyAccessToken,
	updatePassword,
	updateCompany,
};
