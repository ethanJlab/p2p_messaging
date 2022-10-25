const express = require('express'); 
const Gun = require('gun');
const app = express();
const port = 3040;

app.use(Gun.serve);

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

Gun({web: server});
