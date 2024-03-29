const StateAdminTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verification</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="max-w-screen-lg mx-auto mt-8">
        <!-- Content Section -->
        <div class="bg-white shadow-md rounded-lg px-8 py-6 mt-8">
            <h1 class="text-gray-800 text-lg font-semibold">Hello %NAME%,</h1>
            <p class="text-gray-700 mt-2">Thank you for registering on our application as a StateAdmin. You are successfully registered and welcome to our platform!</p>
            <p class="text-gray-700 mt-2">Thank you for choosing to be a part of our community.</p>              
        </div>
    </div>
</body>
</html>`;

export default StateAdminTemplate;
