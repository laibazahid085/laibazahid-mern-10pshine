// jest.setup.js

import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Fix for jsdom environment where TextEncoder/TextDecoder might be missing
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
