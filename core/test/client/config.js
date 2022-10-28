var config = {
    api:{
        host: "",
        port: 80,
        secure: false,
        version: "v1"
    },
    cdn: {
        hostname: "",
        domain: "",
        env : "development"
    },
    env: "development"
};

window.config = window.btoa(JSON.stringify(config));
