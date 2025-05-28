// Test script to verify password validation patterns
const frontendPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
const backendPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
const oldFrontendPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

const testPassword = 'Qazwsxedc12!'; // Changed # to ! (allowed special character)
const invalidPassword = 'Qazwsxedc12#'; // # is not allowed

console.log('Testing valid password:', testPassword);
console.log('Frontend pattern (new):', frontendPattern.test(testPassword));
console.log('Backend pattern:', backendPattern.test(testPassword));
console.log('Old frontend pattern:', oldFrontendPattern.test(testPassword));

console.log('\nTesting invalid password with #:', invalidPassword);
console.log('Frontend pattern (new):', frontendPattern.test(invalidPassword));
console.log('Backend pattern:', backendPattern.test(invalidPassword));

console.log('\nAllowed special characters: @$!%*?&');
console.log('Invalid special characters: #^()[]{}|\\:";\'<>,./?~`');

// Test with some other passwords
const testPasswords = [
  'Qazwsxedc12#',
  'StrongPass123!',
  'MySecure123@',
  'Test1234&Strong',
  'weak', // should fail
  'NoSpecialChar123', // should fail
  'nouppercAse123!', // should fail
  'NOLOWERCASE123!', // should fail
  'NoNumbers!@#', // should fail
];

console.log('\nTesting multiple passwords:');
testPasswords.forEach(password => {
  console.log(`${password}: ${frontendPattern.test(password) ? 'VALID' : 'INVALID'}`);
});
