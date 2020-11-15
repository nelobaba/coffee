import { registerAs } from "@nestjs/config"; // registers namespace as coffees as keys in config

export default registerAs('coffees', () => ({ // 👈
    foo: 'bar', // 👈
}));