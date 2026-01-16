const fetch = require('node-fetch');

async function testAPI() {
    console.log('Testing Certificate Config API...');

    try {
        // Test GET global config
        console.log('\n1. Testing GET /api/certificate-configs/global');
        const getResponse = await fetch('http://localhost:3000/api/certificate-configs/global');
        console.log('Status:', getResponse.status);
        if (getResponse.ok) {
            const data = await getResponse.json();
            console.log('Response:', data);
        } else {
            console.log('No global config found (expected for first test)');
        }

        // Test POST global config
        console.log('\n2. Testing POST /api/certificate-configs');
        const testConfig = {
            userNameFontSize: 40,
            userNameTop: 140,
            signature1Name: "Test Admin"
        };
        const postResponse = await fetch('http://localhost:3000/api/certificate-configs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                config_key: 'global',
                config_value: JSON.stringify(testConfig)
            })
        });
        console.log('Status:', postResponse.status);
        if (postResponse.ok) {
            const data = await postResponse.json();
            console.log('Response:', data);
        }

        // Test GET again to verify it was saved
        console.log('\n3. Testing GET /api/certificate-configs/global after POST');
        const getResponse2 = await fetch('http://localhost:3000/api/certificate-configs/global');
        console.log('Status:', getResponse2.status);
        if (getResponse2.ok) {
            const data = await getResponse2.json();
            console.log('Response:', data);
            const parsedConfig = JSON.parse(data.config_value);
            console.log('Parsed config:', parsedConfig);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAPI();
