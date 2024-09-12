// Regular expression to validate an email address.
// Explanation:
// - [\w.-]+: Matches one or more word characters (letters, digits, underscores) or dot or hyphen characters.
// - @: Matches the '@' symbol.
// - ([\w-]+\.)+: Matches one or more sequences of word characters or hyphens followed by a dot, representing the domain part of the email.
// - [\w-]{2,4}$: Matches 2 to 4 word characters or hyphens at the end of the email, representing the top-level domain.
export const EMAIL_REGEX = /[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;

// Regular expression to validate a password.
// Explanation:
// - ^(?=.*\d): Ensures the presence of at least one digit.
// - (?=.*[a-z]): Ensures the presence of at least one lowercase letter.
// - (?=.*[A-Z]): Ensures the presence of at least one uppercase letter.
// - (?=.*[a-zA-Z]): Ensures the presence of at least one letter.
// - .{8,}$: Matches any character (except newline) at least 8 times.
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

// Regular expression to validate a name.
// Explanation:
// - (^[A-Za-z]{3,16}): Matches 3 to 16 alphabetic characters at the beginning of the name.
// - ([ ]{0,1}): Matches zero or one space.
// - ([A-Za-z]{3,16})?: Matches 3 to 16 alphabetic characters, allowing zero or one occurrence.
// - ([ ]{0,1})?: Matches zero or one space.
// - ([A-Za-z]{3,16})?: Matches 3 to 16 alphabetic characters, allowing zero or one occurrence.
// - ([ ]{0,1})?: Matches zero or one space.
// - ([A-Za-z]{3,16}): Matches 3 to 16 alphabetic characters at the end of the name.
export const NAME_REGEX = /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/;
