// Validation patterns
const PATTERNS = {
    NAME_PATTERN: /^[a-zA-ZÀ-ỹ\s]+$/,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    HAS_UPPERCASE: /[A-Z]/,
    HAS_LOWERCASE: /[a-z]/,
    HAS_NUMBER: /[0-9]/,
    HAS_SPECIAL_CHAR: /[!@#$%^&*(),.?":{}|<>]/
};

const commonValidations = {
    isNotEmpty: (value) => value.trim() !== '',
    hasMinLength: (value, length) => value.length >= length,
    matchesPattern: (value, pattern) => pattern.test(value)
};

const validationRules = {
    name: [
        {
            test: commonValidations.isNotEmpty,
            message: 'Tên không được để trống'
        },
        {
            test: (value) => commonValidations.hasMinLength(value, 2),
            message: 'Tên phải có ít nhất 2 ký tự'
        },
        {
            test: (value) => commonValidations.matchesPattern(value, PATTERNS.NAME_PATTERN),
            message: 'Tên chỉ được chứa chữ cái và khoảng trắng'
        }
    ],
    email: [
        {
            test: commonValidations.isNotEmpty,
            message: 'Email không được để trống'
        },
        {
            test: (value) => commonValidations.matchesPattern(value, PATTERNS.EMAIL_PATTERN),
            message: 'Email không hợp lệ'
        }
    ],
    password: [
        {
            test: commonValidations.isNotEmpty,
            message: 'Mật khẩu không được để trống'
        },
        {
            test: (value) => commonValidations.hasMinLength(value, 8),
            message: 'Mật khẩu phải có ít nhất 8 ký tự'
        },
        {
            test: (value) => commonValidations.matchesPattern(value, PATTERNS.HAS_UPPERCASE),
            message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa'
        },
        {
            test: (value) => commonValidations.matchesPattern(value, PATTERNS.HAS_LOWERCASE),
            message: 'Mật khẩu phải chứa ít nhất 1 chữ thường'
        },
        {
            test: (value) => commonValidations.matchesPattern(value, PATTERNS.HAS_NUMBER),
            message: 'Mật khẩu phải chứa ít nhất 1 số'
        },
        {
            test: (value) => commonValidations.matchesPattern(value, PATTERNS.HAS_SPECIAL_CHAR),
            message: 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt'
        }
    ],
    password_confirmation: [
        {
            test: commonValidations.isNotEmpty,
            message: 'Xác nhận mật khẩu không được để trống'
        }
    ]
};

export const validateField = (fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return { isValid: true, error: null };

    const failedRule = rules.find(rule => !rule.test(value));
    return failedRule
        ? { isValid: false, error: failedRule.message }
        : { isValid: true, error: null };
};

export const validateForm = (formData) => {
    const validationResults = Object.entries(formData)
        .filter(([fieldName]) => validationRules[fieldName])
        .map(([fieldName, value]) => ({
            fieldName,
            ...validateField(fieldName, value)
        }));

    const errors = validationResults
        .filter(result => !result.isValid)
        .reduce((acc, { fieldName, error }) => ({
            ...acc,
            [fieldName]: error
        }), {});

    return {
        isValid: validationResults.every(result => result.isValid),
        errors
    };
};

export const validatePasswordConfirmation = (password, confirmation) => ({
    isValid: password === confirmation,
    error: password !== confirmation ? 'Mật khẩu xác nhận không khớp' : null
});
export const addValidationRule = (fieldName, testFn, message) => {
    validationRules[fieldName] = validationRules[fieldName] || [];
    validationRules[fieldName].push({ test: testFn, message });
};