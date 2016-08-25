import <%= safeName%> from "./<%= safeName%>"

window.onload = () => {
    const app = new <%= safeName%>();
    app.test();
};