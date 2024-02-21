var mi = Object.defineProperty;
var o = (r, t) => mi(r, "name", { value: t, configurable: !0 });
var ms = (() => {
    for (var r = new Uint8Array(128), t = 0; t < 64; t++)
        r[t < 26 ? t + 65 : t < 52 ? t + 71 : t < 62 ? t - 4 : t * 4 - 205] = t;
    return (c) => {
        for (
            var w = c.length,
                S = new Uint8Array(
                    (((w - (c[w - 1] == "=") - (c[w - 2] == "=")) * 3) / 4) | 0
                ),
                L = 0,
                K = 0;
            L < w;

        ) {
            var j = r[c.charCodeAt(L++)],
                q = r[c.charCodeAt(L++)],
                Z = r[c.charCodeAt(L++)],
                ue = r[c.charCodeAt(L++)];
            (S[K++] = (j << 2) | (q >> 4)),
                (S[K++] = (q << 4) | (Z >> 2)),
                (S[K++] = (Z << 6) | ue);
        }
        return S;
    };
})();
function Ee(r) {
    return (r * Math.PI) / 180;
}
o(Ee, "deg2rad");
function Je(r) {
    return (r * 180) / Math.PI;
}
o(Je, "rad2deg");
function Me(r, t, c) {
    return t > c ? Me(r, c, t) : Math.min(Math.max(r, t), c);
}
o(Me, "clamp");
function Se(r, t, c) {
    if (typeof r == "number" && typeof t == "number") return r + (t - r) * c;
    if (r instanceof y && t instanceof y) return r.lerp(t, c);
    if (r instanceof $ && t instanceof $) return r.lerp(t, c);
    throw new Error(
        `Bad value for lerp(): ${r}, ${t}. Only number, Vec2 and Color is supported.`
    );
}
o(Se, "lerp");
function Nt(r, t, c, w, S) {
    return w + ((r - t) / (c - t)) * (S - w);
}
o(Nt, "map");
function gs(r, t, c, w, S) {
    return Me(Nt(r, t, c, w, S), w, S);
}
o(gs, "mapc");
var y = class r {
    static {
        o(this, "Vec2");
    }
    x = 0;
    y = 0;
    constructor(t = 0, c = t) {
        (this.x = t), (this.y = c);
    }
    static fromAngle(t) {
        let c = Ee(t);
        return new r(Math.cos(c), Math.sin(c));
    }
    static LEFT = new r(-1, 0);
    static RIGHT = new r(1, 0);
    static UP = new r(0, -1);
    static DOWN = new r(0, 1);
    clone() {
        return new r(this.x, this.y);
    }
    add(...t) {
        let c = C(...t);
        return new r(this.x + c.x, this.y + c.y);
    }
    sub(...t) {
        let c = C(...t);
        return new r(this.x - c.x, this.y - c.y);
    }
    scale(...t) {
        let c = C(...t);
        return new r(this.x * c.x, this.y * c.y);
    }
    dist(...t) {
        let c = C(...t);
        return this.sub(c).len();
    }
    sdist(...t) {
        let c = C(...t);
        return this.sub(c).slen();
    }
    len() {
        return Math.sqrt(this.dot(this));
    }
    slen() {
        return this.dot(this);
    }
    unit() {
        let t = this.len();
        return t === 0 ? new r(0) : this.scale(1 / t);
    }
    normal() {
        return new r(this.y, -this.x);
    }
    reflect(t) {
        return this.sub(t.scale(2 * this.dot(t)));
    }
    project(t) {
        return t.scale(t.dot(this) / t.len());
    }
    reject(t) {
        return this.sub(this.project(t));
    }
    dot(t) {
        return this.x * t.x + this.y * t.y;
    }
    cross(t) {
        return this.x * t.y - this.y * t.x;
    }
    angle(...t) {
        let c = C(...t);
        return Je(Math.atan2(this.y - c.y, this.x - c.x));
    }
    angleBetween(...t) {
        let c = C(...t);
        return Je(Math.atan2(this.cross(c), this.dot(c)));
    }
    lerp(t, c) {
        return new r(Se(this.x, t.x, c), Se(this.y, t.y, c));
    }
    slerp(t, c) {
        let w = this.dot(t),
            S = this.cross(t),
            L = Math.atan2(S, w);
        return this.scale(Math.sin((1 - c) * L))
            .add(t.scale(Math.sin(c * L)))
            .scale(1 / S);
    }
    isZero() {
        return this.x === 0 && this.y === 0;
    }
    toFixed(t) {
        return new r(Number(this.x.toFixed(t)), Number(this.y.toFixed(t)));
    }
    transform(t) {
        return t.multVec2(this);
    }
    eq(t) {
        return this.x === t.x && this.y === t.y;
    }
    bbox() {
        return new he(this, 0, 0);
    }
    toString() {
        return `vec2(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
    }
};
function C(...r) {
    if (r.length === 1) {
        if (r[0] instanceof y) return new y(r[0].x, r[0].y);
        if (Array.isArray(r[0]) && r[0].length === 2) return new y(...r[0]);
    }
    return new y(...r);
}
o(C, "vec2");
var $ = class r {
    static {
        o(this, "Color");
    }
    r = 255;
    g = 255;
    b = 255;
    constructor(t, c, w) {
        (this.r = Me(t, 0, 255)),
            (this.g = Me(c, 0, 255)),
            (this.b = Me(w, 0, 255));
    }
    static fromArray(t) {
        return new r(t[0], t[1], t[2]);
    }
    static fromHex(t) {
        if (typeof t == "number")
            return new r((t >> 16) & 255, (t >> 8) & 255, (t >> 0) & 255);
        if (typeof t == "string") {
            let c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
            return new r(
                parseInt(c[1], 16),
                parseInt(c[2], 16),
                parseInt(c[3], 16)
            );
        } else throw new Error("Invalid hex color format");
    }
    static fromHSL(t, c, w) {
        if (c == 0) return new r(255 * w, 255 * w, 255 * w);
        let S = o(
                (ue, U, J) => (
                    J < 0 && (J += 1),
                    J > 1 && (J -= 1),
                    J < 1 / 6
                        ? ue + (U - ue) * 6 * J
                        : J < 1 / 2
                        ? U
                        : J < 2 / 3
                        ? ue + (U - ue) * (2 / 3 - J) * 6
                        : ue
                ),
                "hue2rgb"
            ),
            L = w < 0.5 ? w * (1 + c) : w + c - w * c,
            K = 2 * w - L,
            j = S(K, L, t + 1 / 3),
            q = S(K, L, t),
            Z = S(K, L, t - 1 / 3);
        return new r(
            Math.round(j * 255),
            Math.round(q * 255),
            Math.round(Z * 255)
        );
    }
    static RED = new r(255, 0, 0);
    static GREEN = new r(0, 255, 0);
    static BLUE = new r(0, 0, 255);
    static YELLOW = new r(255, 255, 0);
    static MAGENTA = new r(255, 0, 255);
    static CYAN = new r(0, 255, 255);
    static WHITE = new r(255, 255, 255);
    static BLACK = new r(0, 0, 0);
    clone() {
        return new r(this.r, this.g, this.b);
    }
    lighten(t) {
        return new r(this.r + t, this.g + t, this.b + t);
    }
    darken(t) {
        return this.lighten(-t);
    }
    invert() {
        return new r(255 - this.r, 255 - this.g, 255 - this.b);
    }
    mult(t) {
        return new r(
            (this.r * t.r) / 255,
            (this.g * t.g) / 255,
            (this.b * t.b) / 255
        );
    }
    lerp(t, c) {
        return new r(
            Se(this.r, t.r, c),
            Se(this.g, t.g, c),
            Se(this.b, t.b, c)
        );
    }
    eq(t) {
        return this.r === t.r && this.g === t.g && this.b === t.b;
    }
    toString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
    toHex() {
        return (
            "#" +
            ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b)
                .toString(16)
                .slice(1)
        );
    }
};
function W(...r) {
    if (r.length === 0) return new $(255, 255, 255);
    if (r.length === 1) {
        if (r[0] instanceof $) return r[0].clone();
        if (typeof r[0] == "string") return $.fromHex(r[0]);
        if (Array.isArray(r[0]) && r[0].length === 3) return $.fromArray(r[0]);
    }
    return new $(...r);
}
o(W, "rgb");
var ws = o((r, t, c) => $.fromHSL(r, t, c), "hsl2rgb"),
    oe = class r {
        static {
            o(this, "Quad");
        }
        x = 0;
        y = 0;
        w = 1;
        h = 1;
        constructor(t, c, w, S) {
            (this.x = t), (this.y = c), (this.w = w), (this.h = S);
        }
        scale(t) {
            return new r(
                this.x + this.w * t.x,
                this.y + this.h * t.y,
                this.w * t.w,
                this.h * t.h
            );
        }
        pos() {
            return new y(this.x, this.y);
        }
        clone() {
            return new r(this.x, this.y, this.w, this.h);
        }
        eq(t) {
            return (
                this.x === t.x &&
                this.y === t.y &&
                this.w === t.w &&
                this.h === t.h
            );
        }
        toString() {
            return `quad(${this.x}, ${this.y}, ${this.w}, ${this.h})`;
        }
    };
function ae(r, t, c, w) {
    return new oe(r, t, c, w);
}
o(ae, "quad");
var be = class r {
    static {
        o(this, "Mat4");
    }
    m = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    constructor(t) {
        t && (this.m = t);
    }
    static translate(t) {
        return new r([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t.x, t.y, 0, 1]);
    }
    static scale(t) {
        return new r([t.x, 0, 0, 0, 0, t.y, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
    static rotateX(t) {
        t = Ee(-t);
        let c = Math.cos(t),
            w = Math.sin(t);
        return new r([1, 0, 0, 0, 0, c, -w, 0, 0, w, c, 0, 0, 0, 0, 1]);
    }
    static rotateY(t) {
        t = Ee(-t);
        let c = Math.cos(t),
            w = Math.sin(t);
        return new r([c, 0, w, 0, 0, 1, 0, 0, -w, 0, c, 0, 0, 0, 0, 1]);
    }
    static rotateZ(t) {
        t = Ee(-t);
        let c = Math.cos(t),
            w = Math.sin(t);
        return new r([c, -w, 0, 0, w, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
    translate(t) {
        return (
            (this.m[12] += this.m[0] * t.x + this.m[4] * t.y),
            (this.m[13] += this.m[1] * t.x + this.m[5] * t.y),
            (this.m[14] += this.m[2] * t.x + this.m[6] * t.y),
            (this.m[15] += this.m[3] * t.x + this.m[7] * t.y),
            this
        );
    }
    scale(t) {
        return (
            (this.m[0] *= t.x),
            (this.m[4] *= t.y),
            (this.m[1] *= t.x),
            (this.m[5] *= t.y),
            (this.m[2] *= t.x),
            (this.m[6] *= t.y),
            (this.m[3] *= t.x),
            (this.m[7] *= t.y),
            this
        );
    }
    rotate(t) {
        t = Ee(-t);
        let c = Math.cos(t),
            w = Math.sin(t),
            S = this.m[0],
            L = this.m[1],
            K = this.m[4],
            j = this.m[5];
        return (
            (this.m[0] = S * c + L * w),
            (this.m[1] = -S * w + L * c),
            (this.m[4] = K * c + j * w),
            (this.m[5] = -K * w + j * c),
            this
        );
    }
    mult(t) {
        let c = [];
        for (let w = 0; w < 4; w++)
            for (let S = 0; S < 4; S++)
                c[w * 4 + S] =
                    this.m[0 * 4 + S] * t.m[w * 4 + 0] +
                    this.m[1 * 4 + S] * t.m[w * 4 + 1] +
                    this.m[2 * 4 + S] * t.m[w * 4 + 2] +
                    this.m[3 * 4 + S] * t.m[w * 4 + 3];
        return new r(c);
    }
    multVec2(t) {
        return new y(
            t.x * this.m[0] + t.y * this.m[4] + this.m[12],
            t.x * this.m[1] + t.y * this.m[5] + this.m[13]
        );
    }
    getTranslation() {
        return new y(this.m[12], this.m[13]);
    }
    getScale() {
        if (this.m[0] != 0 || this.m[1] != 0) {
            let t = this.m[0] * this.m[5] - this.m[1] * this.m[4],
                c = Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1]);
            return new y(c, t / c);
        } else if (this.m[4] != 0 || this.m[5] != 0) {
            let t = this.m[0] * this.m[5] - this.m[1] * this.m[4],
                c = Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5]);
            return new y(t / c, c);
        } else return new y(0, 0);
    }
    getRotation() {
        if (this.m[0] != 0 || this.m[1] != 0) {
            let t = Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1]);
            return Je(
                this.m[1] > 0
                    ? Math.acos(this.m[0] / t)
                    : -Math.acos(this.m[0] / t)
            );
        } else if (this.m[4] != 0 || this.m[5] != 0) {
            let t = Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5]);
            return Je(
                Math.PI / 2 -
                    (this.m[5] > 0
                        ? Math.acos(-this.m[4] / t)
                        : -Math.acos(this.m[4] / t))
            );
        } else return 0;
    }
    getSkew() {
        if (this.m[0] != 0 || this.m[1] != 0) {
            let t = Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1]);
            return new y(
                Math.atan(this.m[0] * this.m[4] + this.m[1] * this.m[5]) /
                    (t * t),
                0
            );
        } else if (this.m[4] != 0 || this.m[5] != 0) {
            let t = Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5]);
            return new y(
                0,
                Math.atan(this.m[0] * this.m[4] + this.m[1] * this.m[5]) /
                    (t * t)
            );
        } else return new y(0, 0);
    }
    invert() {
        let t = [],
            c = this.m[10] * this.m[15] - this.m[14] * this.m[11],
            w = this.m[9] * this.m[15] - this.m[13] * this.m[11],
            S = this.m[9] * this.m[14] - this.m[13] * this.m[10],
            L = this.m[8] * this.m[15] - this.m[12] * this.m[11],
            K = this.m[8] * this.m[14] - this.m[12] * this.m[10],
            j = this.m[8] * this.m[13] - this.m[12] * this.m[9],
            q = this.m[6] * this.m[15] - this.m[14] * this.m[7],
            Z = this.m[5] * this.m[15] - this.m[13] * this.m[7],
            ue = this.m[5] * this.m[14] - this.m[13] * this.m[6],
            U = this.m[4] * this.m[15] - this.m[12] * this.m[7],
            J = this.m[4] * this.m[14] - this.m[12] * this.m[6],
            d = this.m[5] * this.m[15] - this.m[13] * this.m[7],
            Q = this.m[4] * this.m[13] - this.m[12] * this.m[5],
            O = this.m[6] * this.m[11] - this.m[10] * this.m[7],
            He = this.m[5] * this.m[11] - this.m[9] * this.m[7],
            Ge = this.m[5] * this.m[10] - this.m[9] * this.m[6],
            v = this.m[4] * this.m[11] - this.m[8] * this.m[7],
            le = this.m[4] * this.m[10] - this.m[8] * this.m[6],
            pe = this.m[4] * this.m[9] - this.m[8] * this.m[5];
        (t[0] = this.m[5] * c - this.m[6] * w + this.m[7] * S),
            (t[4] = -(this.m[4] * c - this.m[6] * L + this.m[7] * K)),
            (t[8] = this.m[4] * w - this.m[5] * L + this.m[7] * j),
            (t[12] = -(this.m[4] * S - this.m[5] * K + this.m[6] * j)),
            (t[1] = -(this.m[1] * c - this.m[2] * w + this.m[3] * S)),
            (t[5] = this.m[0] * c - this.m[2] * L + this.m[3] * K),
            (t[9] = -(this.m[0] * w - this.m[1] * L + this.m[3] * j)),
            (t[13] = this.m[0] * S - this.m[1] * K + this.m[2] * j),
            (t[2] = this.m[1] * q - this.m[2] * Z + this.m[3] * ue),
            (t[6] = -(this.m[0] * q - this.m[2] * U + this.m[3] * J)),
            (t[10] = this.m[0] * d - this.m[1] * U + this.m[3] * Q),
            (t[14] = -(this.m[0] * ue - this.m[1] * J + this.m[2] * Q)),
            (t[3] = -(this.m[1] * O - this.m[2] * He + this.m[3] * Ge)),
            (t[7] = this.m[0] * O - this.m[2] * v + this.m[3] * le),
            (t[11] = -(this.m[0] * He - this.m[1] * v + this.m[3] * pe)),
            (t[15] = this.m[0] * Ge - this.m[1] * le + this.m[2] * pe);
        let ne =
            this.m[0] * t[0] +
            this.m[1] * t[4] +
            this.m[2] * t[8] +
            this.m[3] * t[12];
        for (let re = 0; re < 4; re++)
            for (let ye = 0; ye < 4; ye++) t[re * 4 + ye] *= 1 / ne;
        return new r(t);
    }
    clone() {
        return new r([...this.m]);
    }
    toString() {
        return this.m.toString();
    }
};
function Pn(r, t, c, w = (S) => -Math.cos(S)) {
    return r + ((w(c) + 1) / 2) * (t - r);
}
o(Pn, "wave");
var pi = 1103515245,
    gi = 12345,
    ps = 2147483648,
    mt = class {
        static {
            o(this, "RNG");
        }
        seed;
        constructor(t) {
            this.seed = t;
        }
        gen() {
            return (this.seed = (pi * this.seed + gi) % ps), this.seed / ps;
        }
        genNumber(t, c) {
            return t + this.gen() * (c - t);
        }
        genVec2(t, c) {
            return new y(this.genNumber(t.x, c.x), this.genNumber(t.y, c.y));
        }
        genColor(t, c) {
            return new $(
                this.genNumber(t.r, c.r),
                this.genNumber(t.g, c.g),
                this.genNumber(t.b, c.b)
            );
        }
        genAny(...t) {
            if (t.length === 0) return this.gen();
            if (t.length === 1) {
                if (typeof t[0] == "number") return this.genNumber(0, t[0]);
                if (t[0] instanceof y) return this.genVec2(C(0, 0), t[0]);
                if (t[0] instanceof $) return this.genColor(W(0, 0, 0), t[0]);
            } else if (t.length === 2) {
                if (typeof t[0] == "number" && typeof t[1] == "number")
                    return this.genNumber(t[0], t[1]);
                if (t[0] instanceof y && t[1] instanceof y)
                    return this.genVec2(t[0], t[1]);
                if (t[0] instanceof $ && t[1] instanceof $)
                    return this.genColor(t[0], t[1]);
            }
        }
    },
    An = new mt(Date.now());
function vs(r) {
    return r != null && (An.seed = r), An.seed;
}
o(vs, "randSeed");
function wt(...r) {
    return An.genAny(...r);
}
o(wt, "rand");
function Mn(...r) {
    return Math.floor(wt(...r));
}
o(Mn, "randi");
function bs(r) {
    return wt() <= r;
}
o(bs, "chance");
function ys(r) {
    return r[Mn(r.length)];
}
o(ys, "choose");
function xs(r, t) {
    return (
        r.pos.x + r.width > t.pos.x &&
        r.pos.x < t.pos.x + t.width &&
        r.pos.y + r.height > t.pos.y &&
        r.pos.y < t.pos.y + t.height
    );
}
o(xs, "testRectRect");
function wi(r, t) {
    if (
        (r.p1.x === r.p2.x && r.p1.y === r.p2.y) ||
        (t.p1.x === t.p2.x && t.p1.y === t.p2.y)
    )
        return null;
    let c =
        (t.p2.y - t.p1.y) * (r.p2.x - r.p1.x) -
        (t.p2.x - t.p1.x) * (r.p2.y - r.p1.y);
    if (c === 0) return null;
    let w =
            ((t.p2.x - t.p1.x) * (r.p1.y - t.p1.y) -
                (t.p2.y - t.p1.y) * (r.p1.x - t.p1.x)) /
            c,
        S =
            ((r.p2.x - r.p1.x) * (r.p1.y - t.p1.y) -
                (r.p2.y - r.p1.y) * (r.p1.x - t.p1.x)) /
            c;
    return w < 0 || w > 1 || S < 0 || S > 1 ? null : w;
}
o(wi, "testLineLineT");
function We(r, t) {
    let c = wi(r, t);
    return c
        ? C(r.p1.x + c * (r.p2.x - r.p1.x), r.p1.y + c * (r.p2.y - r.p1.y))
        : null;
}
o(We, "testLineLine");
function Us(r, t) {
    if (pt(r, t.p1) || pt(r, t.p2)) return !0;
    let c = r.points();
    return (
        !!We(t, new Pe(c[0], c[1])) ||
        !!We(t, new Pe(c[1], c[2])) ||
        !!We(t, new Pe(c[2], c[3])) ||
        !!We(t, new Pe(c[3], c[0]))
    );
}
o(Us, "testRectLine");
function pt(r, t) {
    return (
        t.x > r.pos.x &&
        t.x < r.pos.x + r.width &&
        t.y > r.pos.y &&
        t.y < r.pos.y + r.height
    );
}
o(pt, "testRectPoint");
function Es(r, t) {
    let c = t.sub(r.p1),
        w = r.p2.sub(r.p1);
    if (Math.abs(c.cross(w)) > Number.EPSILON) return !1;
    let S = c.dot(w) / w.dot(w);
    return S >= 0 && S <= 1;
}
o(Es, "testLinePoint");
function Rn(r, t) {
    let c = r.p2.sub(r.p1),
        w = c.dot(c),
        S = r.p1.sub(t.center),
        L = 2 * c.dot(S),
        K = S.dot(S) - t.radius * t.radius,
        j = L * L - 4 * w * K;
    if (w <= Number.EPSILON || j < 0) return !1;
    if (j == 0) {
        let q = -L / (2 * w);
        if (q >= 0 && q <= 1) return !0;
    } else {
        let q = (-L + Math.sqrt(j)) / (2 * w),
            Z = (-L - Math.sqrt(j)) / (2 * w);
        if ((q >= 0 && q <= 1) || (Z >= 0 && Z <= 1)) return !0;
    }
    return Ss(t, r.p1);
}
o(Rn, "testLineCircle");
function Ss(r, t) {
    return r.center.sdist(t) < r.radius * r.radius;
}
o(Ss, "testCirclePoint");
function Cs(r, t) {
    let c = t.pts[t.pts.length - 1];
    for (let w of t.pts) {
        if (Rn(new Pe(c, w), r)) return !0;
        c = w;
    }
    return Ss(r, t.pts[0]) ? !0 : Dn(t, r.center);
}
o(Cs, "testCirclePolygon");
function Dn(r, t) {
    let c = !1,
        w = r.pts;
    for (let S = 0, L = w.length - 1; S < w.length; L = S++)
        w[S].y > t.y != w[L].y > t.y &&
            t.x <
                ((w[L].x - w[S].x) * (t.y - w[S].y)) / (w[L].y - w[S].y) +
                    w[S].x &&
            (c = !c);
    return c;
}
o(Dn, "testPolygonPoint");
var Pe = class r {
        static {
            o(this, "Line");
        }
        p1;
        p2;
        constructor(t, c) {
            (this.p1 = t.clone()), (this.p2 = c.clone());
        }
        transform(t) {
            return new r(t.multVec2(this.p1), t.multVec2(this.p2));
        }
        bbox() {
            return he.fromPoints(this.p1, this.p2);
        }
        area() {
            return this.p1.dist(this.p2);
        }
        clone() {
            return new r(this.p1, this.p2);
        }
    },
    he = class r {
        static {
            o(this, "Rect");
        }
        pos;
        width;
        height;
        constructor(t, c, w) {
            (this.pos = t.clone()), (this.width = c), (this.height = w);
        }
        static fromPoints(t, c) {
            return new r(t.clone(), c.x - t.x, c.y - t.y);
        }
        center() {
            return new y(
                this.pos.x + this.width / 2,
                this.pos.y + this.height / 2
            );
        }
        points() {
            return [
                this.pos,
                this.pos.add(this.width, 0),
                this.pos.add(this.width, this.height),
                this.pos.add(0, this.height),
            ];
        }
        transform(t) {
            return new _e(this.points().map((c) => t.multVec2(c)));
        }
        bbox() {
            return this.clone();
        }
        area() {
            return this.width * this.height;
        }
        clone() {
            return new r(this.pos.clone(), this.width, this.height);
        }
        distToPoint(t) {
            return Math.sqrt(this.sdistToPoint(t));
        }
        sdistToPoint(t) {
            let c = this.pos,
                w = this.pos.add(this.width, this.height),
                S = Math.max(c.x - t.x, 0, t.x - w.x),
                L = Math.max(c.y - t.y, 0, t.y - w.y);
            return S * S + L * L;
        }
    },
    gt = class r {
        static {
            o(this, "Circle");
        }
        center;
        radius;
        constructor(t, c) {
            (this.center = t.clone()), (this.radius = c);
        }
        transform(t) {
            return new On(this.center, this.radius, this.radius).transform(t);
        }
        bbox() {
            return he.fromPoints(
                this.center.sub(C(this.radius)),
                this.center.add(C(this.radius))
            );
        }
        area() {
            return this.radius * this.radius * Math.PI;
        }
        clone() {
            return new r(this.center, this.radius);
        }
    },
    On = class r {
        static {
            o(this, "Ellipse");
        }
        center;
        radiusX;
        radiusY;
        constructor(t, c, w) {
            (this.center = t.clone()), (this.radiusX = c), (this.radiusY = w);
        }
        transform(t) {
            return new r(
                t.multVec2(this.center),
                t.m[0] * this.radiusX,
                t.m[5] * this.radiusY
            );
        }
        bbox() {
            return he.fromPoints(
                this.center.sub(C(this.radiusX, this.radiusY)),
                this.center.add(C(this.radiusX, this.radiusY))
            );
        }
        area() {
            return this.radiusX * this.radiusY * Math.PI;
        }
        clone() {
            return new r(this.center, this.radiusX, this.radiusY);
        }
    },
    _e = class r {
        static {
            o(this, "Polygon");
        }
        pts;
        constructor(t) {
            if (t.length < 3)
                throw new Error("Polygons should have at least 3 vertices");
            this.pts = t;
        }
        transform(t) {
            return new r(this.pts.map((c) => t.multVec2(c)));
        }
        bbox() {
            let t = C(Number.MAX_VALUE),
                c = C(-Number.MAX_VALUE);
            for (let w of this.pts)
                (t.x = Math.min(t.x, w.x)),
                    (c.x = Math.max(c.x, w.x)),
                    (t.y = Math.min(t.y, w.y)),
                    (c.y = Math.max(c.y, w.y));
            return he.fromPoints(t, c);
        }
        area() {
            let t = 0,
                c = this.pts.length;
            for (let w = 0; w < c; w++) {
                let S = this.pts[w],
                    L = this.pts[(w + 1) % c];
                (t += S.x * L.y * 0.5), (t -= L.x * S.y * 0.5);
            }
            return Math.abs(t);
        }
        clone() {
            return new r(this.pts.map((t) => t.clone()));
        }
    };
function Ts(r, t) {
    let c = Number.MAX_VALUE,
        w = C(0);
    for (let S of [r, t])
        for (let L = 0; L < S.pts.length; L++) {
            let K = S.pts[L],
                q = S.pts[(L + 1) % S.pts.length].sub(K).normal().unit(),
                Z = Number.MAX_VALUE,
                ue = -Number.MAX_VALUE;
            for (let Q = 0; Q < r.pts.length; Q++) {
                let O = r.pts[Q].dot(q);
                (Z = Math.min(Z, O)), (ue = Math.max(ue, O));
            }
            let U = Number.MAX_VALUE,
                J = -Number.MAX_VALUE;
            for (let Q = 0; Q < t.pts.length; Q++) {
                let O = t.pts[Q].dot(q);
                (U = Math.min(U, O)), (J = Math.max(J, O));
            }
            let d = Math.min(ue, J) - Math.max(Z, U);
            if (d < 0) return null;
            if (d < Math.abs(c)) {
                let Q = J - Z,
                    O = U - ue;
                (c = Math.abs(Q) < Math.abs(O) ? Q : O), (w = q.scale(c));
            }
        }
    return w;
}
o(Ts, "sat");
var vt = class extends Map {
        static {
            o(this, "IDList");
        }
        lastID;
        constructor(...t) {
            super(...t), (this.lastID = 0);
        }
        push(t) {
            let c = this.lastID;
            return this.set(c, t), this.lastID++, c;
        }
        pushd(t) {
            let c = this.push(t);
            return () => this.delete(c);
        }
    },
    Re = class r {
        static {
            o(this, "EventController");
        }
        paused = !1;
        cancel;
        constructor(t) {
            this.cancel = t;
        }
        static join(t) {
            let c = new r(() => t.forEach((w) => w.cancel()));
            return (
                Object.defineProperty(c, "paused", {
                    get: () => t[0].paused,
                    set: (w) => t.forEach((S) => (S.paused = w)),
                }),
                (c.paused = !1),
                c
            );
        }
    },
    ve = class {
        static {
            o(this, "Event");
        }
        handlers = new vt();
        add(t) {
            let c = this.handlers.pushd((...S) => {
                    w.paused || t(...S);
                }),
                w = new Re(c);
            return w;
        }
        addOnce(t) {
            let c = this.add((...w) => {
                c.cancel(), t(...w);
            });
            return c;
        }
        next() {
            return new Promise((t) => this.addOnce(t));
        }
        trigger(...t) {
            this.handlers.forEach((c) => c(...t));
        }
        numListeners() {
            return this.handlers.size;
        }
        clear() {
            this.handlers.clear();
        }
    },
    De = class {
        static {
            o(this, "EventHandler");
        }
        handlers = {};
        on(t, c) {
            return (
                this.handlers[t] || (this.handlers[t] = new ve()),
                this.handlers[t].add(c)
            );
        }
        onOnce(t, c) {
            let w = this.on(t, (...S) => {
                w.cancel(), c(...S);
            });
            return w;
        }
        next(t) {
            return new Promise((c) => {
                this.onOnce(t, (...w) => c(w[0]));
            });
        }
        trigger(t, ...c) {
            this.handlers[t] && this.handlers[t].trigger(...c);
        }
        remove(t) {
            delete this.handlers[t];
        }
        clear() {
            this.handlers = {};
        }
        numListeners(t) {
            return this.handlers[t]?.numListeners() ?? 0;
        }
    };
function Gn(r, t) {
    let c = typeof r,
        w = typeof t;
    if (c !== w) return !1;
    if (c === "object" && w === "object" && r !== null && t !== null) {
        let S = Object.keys(r),
            L = Object.keys(t);
        if (S.length !== L.length) return !1;
        for (let K of S) {
            let j = r[K],
                q = t[K];
            if (
                !(typeof j == "function" && typeof q == "function") &&
                !Gn(j, q)
            )
                return !1;
        }
        return !0;
    }
    return r === t;
}
o(Gn, "deepEq");
function vi(r) {
    let t = window.atob(r),
        c = t.length,
        w = new Uint8Array(c);
    for (let S = 0; S < c; S++) w[S] = t.charCodeAt(S);
    return w.buffer;
}
o(vi, "base64ToArrayBuffer");
function As(r) {
    return vi(r.split(",")[1]);
}
o(As, "dataURLToArrayBuffer");
function Ht(r, t) {
    let c = document.createElement("a");
    (c.href = t), (c.download = r), c.click();
}
o(Ht, "download");
function Fn(r, t) {
    Ht(r, "data:text/plain;charset=utf-8," + t);
}
o(Fn, "downloadText");
function Os(r, t) {
    Fn(r, JSON.stringify(t));
}
o(Os, "downloadJSON");
function Bn(r, t) {
    let c = URL.createObjectURL(t);
    Ht(r, c), URL.revokeObjectURL(c);
}
o(Bn, "downloadBlob");
var Ln = o((r) => r.match(/^data:\w+\/\w+;base64,.+/), "isDataURL"),
    Ps = o((r) => r.split(".").pop(), "getExt"),
    Ms = (() => {
        let r = 0;
        return () => r++;
    })();
var _t = class {
    static {
        o(this, "BinaryHeap");
    }
    _items;
    _compareFn;
    constructor(t = (c, w) => c < w) {
        (this._compareFn = t), (this._items = []);
    }
    insert(t) {
        this._items.push(t), this.moveUp(this._items.length - 1);
    }
    remove() {
        if (this._items.length === 0) return null;
        let t = this._items[0],
            c = this._items.pop();
        return (
            this._items.length !== 0 &&
                ((this._items[0] = c), this.moveDown(0)),
            t
        );
    }
    clear() {
        this._items.splice(0, this._items.length);
    }
    moveUp(t) {
        for (; t > 0; ) {
            let c = Math.floor((t - 1) / 2);
            if (
                !this._compareFn(this._items[t], this._items[c]) &&
                this._items[t] >= this._items[c]
            )
                break;
            this.swap(t, c), (t = c);
        }
    }
    moveDown(t) {
        for (; t < Math.floor(this._items.length / 2); ) {
            let c = 2 * t + 1;
            if (
                (c < this._items.length - 1 &&
                    !this._compareFn(this._items[c], this._items[c + 1]) &&
                    ++c,
                this._compareFn(this._items[t], this._items[c]))
            )
                break;
            this.swap(t, c), (t = c);
        }
    }
    swap(t, c) {
        [this._items[t], this._items[c]] = [this._items[c], this._items[t]];
    }
    get length() {
        return this._items.length;
    }
};
var In = {
    "Joy-Con L+R (STANDARD GAMEPAD Vendor: 057e Product: 200e)": {
        buttons: {
            0: "south",
            1: "east",
            2: "west",
            3: "north",
            4: "lshoulder",
            5: "rshoulder",
            6: "ltrigger",
            7: "rtrigger",
            8: "select",
            9: "start",
            10: "lstick",
            11: "rstick",
            12: "dpad-up",
            13: "dpad-down",
            14: "dpad-left",
            15: "dpad-right",
            16: "home",
            17: "capture",
        },
        sticks: { left: { x: 0, y: 1 }, right: { x: 2, y: 3 } },
    },
    "Joy-Con (L) (STANDARD GAMEPAD Vendor: 057e Product: 2006)": {
        buttons: {
            0: "south",
            1: "east",
            2: "west",
            3: "north",
            4: "lshoulder",
            5: "rshoulder",
            9: "select",
            10: "lstick",
            16: "start",
        },
        sticks: { left: { x: 0, y: 1 } },
    },
    "Joy-Con (R) (STANDARD GAMEPAD Vendor: 057e Product: 2007)": {
        buttons: {
            0: "south",
            1: "east",
            2: "west",
            3: "north",
            4: "lshoulder",
            5: "rshoulder",
            9: "start",
            10: "lstick",
            16: "select",
        },
        sticks: { left: { x: 0, y: 1 } },
    },
    "Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)": {
        buttons: {
            0: "south",
            1: "east",
            2: "west",
            3: "north",
            4: "lshoulder",
            5: "rshoulder",
            6: "ltrigger",
            7: "rtrigger",
            8: "select",
            9: "start",
            10: "lstick",
            11: "rstick",
            12: "dpad-up",
            13: "dpad-down",
            14: "dpad-left",
            15: "dpad-right",
            16: "home",
            17: "capture",
        },
        sticks: { left: { x: 0, y: 1 }, right: { x: 2, y: 3 } },
    },
    default: {
        buttons: {
            0: "south",
            1: "east",
            2: "west",
            3: "north",
            4: "lshoulder",
            5: "rshoulder",
            6: "ltrigger",
            7: "rtrigger",
            8: "select",
            9: "start",
            10: "lstick",
            11: "rstick",
            12: "dpad-up",
            13: "dpad-down",
            14: "dpad-left",
            15: "dpad-right",
            16: "home",
        },
        sticks: { left: { x: 0, y: 1 }, right: { x: 2, y: 3 } },
    },
};
var Qe = class {
        static {
            o(this, "ButtonState");
        }
        pressed = new Set([]);
        pressedRepeat = new Set([]);
        released = new Set([]);
        down = new Set([]);
        update() {
            this.pressed.clear(),
                this.released.clear(),
                this.pressedRepeat.clear();
        }
        press(t) {
            this.pressed.add(t), this.pressedRepeat.add(t), this.down.add(t);
        }
        pressRepeat(t) {
            this.pressedRepeat.add(t);
        }
        release(t) {
            this.down.delete(t), this.pressed.delete(t), this.released.add(t);
        }
    },
    Vn = class {
        static {
            o(this, "GamepadState");
        }
        buttonState = new Qe();
        stickState = new Map();
    },
    kn = class {
        static {
            o(this, "FPSCounter");
        }
        dts = [];
        timer = 0;
        fps = 0;
        tick(t) {
            this.dts.push(t),
                (this.timer += t),
                this.timer >= 1 &&
                    ((this.timer = 0),
                    (this.fps = Math.round(
                        1 / (this.dts.reduce((c, w) => c + w) / this.dts.length)
                    )),
                    (this.dts = []));
        }
    },
    Rs = o((r) => {
        if (!r.canvas) throw new Error("Please provide a canvas");
        let t = {
            canvas: r.canvas,
            loopID: null,
            stopped: !1,
            dt: 0,
            time: 0,
            realTime: 0,
            fpsCounter: new kn(),
            timeScale: 1,
            skipTime: !1,
            numFrames: 0,
            mousePos: new y(0),
            mouseDeltaPos: new y(0),
            keyState: new Qe(),
            mouseState: new Qe(),
            mergedGamepadState: new Vn(),
            gamepadStates: new Map(),
            gamepads: [],
            charInputted: [],
            isMouseMoved: !1,
            lastWidth: r.canvas.offsetWidth,
            lastHeight: r.canvas.offsetHeight,
            events: new De(),
        };
        function c() {
            return t.canvas;
        }
        o(c, "canvas");
        function w() {
            return t.dt * t.timeScale;
        }
        o(w, "dt");
        function S() {
            return t.time;
        }
        o(S, "time");
        function L() {
            return t.fpsCounter.fps;
        }
        o(L, "fps");
        function K() {
            return t.numFrames;
        }
        o(K, "numFrames");
        function j() {
            return t.canvas.toDataURL();
        }
        o(j, "screenshot");
        function q(l) {
            t.canvas.style.cursor = l;
        }
        o(q, "setCursor");
        function Z() {
            return t.canvas.style.cursor;
        }
        o(Z, "getCursor");
        function ue(l) {
            if (l)
                try {
                    let x = t.canvas.requestPointerLock();
                    x.catch && x.catch((T) => console.error(T));
                } catch (x) {
                    console.error(x);
                }
            else document.exitPointerLock();
        }
        o(ue, "setCursorLocked");
        function U() {
            return !!document.pointerLockElement;
        }
        o(U, "isCursorLocked");
        function J(l) {
            l.requestFullscreen
                ? l.requestFullscreen()
                : l.webkitRequestFullscreen && l.webkitRequestFullscreen();
        }
        o(J, "enterFullscreen");
        function d() {
            document.exitFullscreen
                ? document.exitFullscreen()
                : document.webkitExitFullScreen &&
                  document.webkitExitFullScreen();
        }
        o(d, "exitFullscreen");
        function Q() {
            return (
                document.fullscreenElement || document.webkitFullscreenElement
            );
        }
        o(Q, "getFullscreenElement");
        function O(l = !0) {
            l ? J(t.canvas) : d();
        }
        o(O, "setFullscreen");
        function He() {
            return !!Q();
        }
        o(He, "isFullscreen");
        function Ge() {
            t.stopped = !0;
            for (let l in ce) t.canvas.removeEventListener(l, ce[l]);
            for (let l in me) document.removeEventListener(l, me[l]);
            for (let l in Te) window.removeEventListener(l, Te[l]);
            Dt.disconnect();
        }
        o(Ge, "quit");
        function v(l) {
            t.loopID !== null && cancelAnimationFrame(t.loopID);
            let x = 0,
                T = o((V) => {
                    if (t.stopped) return;
                    if (document.visibilityState !== "visible") {
                        t.loopID = requestAnimationFrame(T);
                        return;
                    }
                    let ee = V / 1e3,
                        z = ee - t.realTime,
                        Ae = r.maxFPS ? 1 / r.maxFPS : 0;
                    (t.realTime = ee),
                        (x += z),
                        x > Ae &&
                            (t.skipTime ||
                                ((t.dt = x),
                                (t.time += w()),
                                t.fpsCounter.tick(t.dt)),
                            (x = 0),
                            (t.skipTime = !1),
                            t.numFrames++,
                            hn(),
                            l(),
                            Ot()),
                        (t.loopID = requestAnimationFrame(T));
                }, "frame");
            T(0);
        }
        o(v, "run");
        function le() {
            return "ontouchstart" in window || navigator.maxTouchPoints > 0;
        }
        o(le, "isTouchscreen");
        function pe() {
            return t.mousePos.clone();
        }
        o(pe, "mousePos");
        function ne() {
            return t.mouseDeltaPos.clone();
        }
        o(ne, "mouseDeltaPos");
        function re(l = "left") {
            return t.mouseState.pressed.has(l);
        }
        o(re, "isMousePressed");
        function ye(l = "left") {
            return t.mouseState.down.has(l);
        }
        o(ye, "isMouseDown");
        function k(l = "left") {
            return t.mouseState.released.has(l);
        }
        o(k, "isMouseReleased");
        function A() {
            return t.isMouseMoved;
        }
        o(A, "isMouseMoved");
        function tt(l) {
            return l === void 0
                ? t.keyState.pressed.size > 0
                : t.keyState.pressed.has(l);
        }
        o(tt, "isKeyPressed");
        function Ce(l) {
            return l === void 0
                ? t.keyState.pressedRepeat.size > 0
                : t.keyState.pressedRepeat.has(l);
        }
        o(Ce, "isKeyPressedRepeat");
        function Xt(l) {
            return l === void 0
                ? t.keyState.down.size > 0
                : t.keyState.down.has(l);
        }
        o(Xt, "isKeyDown");
        function nt(l) {
            return l === void 0
                ? t.keyState.released.size > 0
                : t.keyState.released.has(l);
        }
        o(nt, "isKeyReleased");
        function qe(l) {
            return l === void 0
                ? t.mergedGamepadState.buttonState.pressed.size > 0
                : t.mergedGamepadState.buttonState.pressed.has(l);
        }
        o(qe, "isGamepadButtonPressed");
        function Wt(l) {
            return l === void 0
                ? t.mergedGamepadState.buttonState.down.size > 0
                : t.mergedGamepadState.buttonState.down.has(l);
        }
        o(Wt, "isGamepadButtonDown");
        function Jt(l) {
            return l === void 0
                ? t.mergedGamepadState.buttonState.released.size > 0
                : t.mergedGamepadState.buttonState.released.has(l);
        }
        o(Jt, "isGamepadButtonReleased");
        function $e(l) {
            return t.events.on("resize", l);
        }
        o($e, "onResize");
        let Qt = o((l, x) => {
                if (typeof l == "function") return t.events.on("keyDown", l);
                if (typeof l == "string" && typeof x == "function")
                    return t.events.on("keyDown", (T) => T === l && x(l));
            }, "onKeyDown"),
            Ke = o((l, x) => {
                if (typeof l == "function") return t.events.on("keyPress", l);
                if (typeof l == "string" && typeof x == "function")
                    return t.events.on("keyPress", (T) => T === l && x(l));
            }, "onKeyPress"),
            Zt = o((l, x) => {
                if (typeof l == "function")
                    return t.events.on("keyPressRepeat", l);
                if (typeof l == "string" && typeof x == "function")
                    return t.events.on(
                        "keyPressRepeat",
                        (T) => T === l && x(l)
                    );
            }, "onKeyPressRepeat"),
            en = o((l, x) => {
                if (typeof l == "function") return t.events.on("keyRelease", l);
                if (typeof l == "string" && typeof x == "function")
                    return t.events.on("keyRelease", (T) => T === l && x(l));
            }, "onKeyRelease");
        function yt(l, x) {
            return typeof l == "function"
                ? t.events.on("mouseDown", (T) => l(T))
                : t.events.on("mouseDown", (T) => T === l && x(T));
        }
        o(yt, "onMouseDown");
        function xt(l, x) {
            return typeof l == "function"
                ? t.events.on("mousePress", (T) => l(T))
                : t.events.on("mousePress", (T) => T === l && x(T));
        }
        o(xt, "onMousePress");
        function Ut(l, x) {
            return typeof l == "function"
                ? t.events.on("mouseRelease", (T) => l(T))
                : t.events.on("mouseRelease", (T) => T === l && x(T));
        }
        o(Ut, "onMouseRelease");
        function Le(l) {
            return t.events.on("mouseMove", () => l(pe(), ne()));
        }
        o(Le, "onMouseMove");
        function tn(l) {
            return t.events.on("charInput", l);
        }
        o(tn, "onCharInput");
        function nn(l) {
            return t.events.on("touchStart", l);
        }
        o(nn, "onTouchStart");
        function sn(l) {
            return t.events.on("touchMove", l);
        }
        o(sn, "onTouchMove");
        function rn(l) {
            return t.events.on("touchEnd", l);
        }
        o(rn, "onTouchEnd");
        function on(l) {
            return t.events.on("scroll", l);
        }
        o(on, "onScroll");
        function an(l) {
            return t.events.on("hide", l);
        }
        o(an, "onHide");
        function Et(l) {
            return t.events.on("show", l);
        }
        o(Et, "onShow");
        function St(l, x) {
            if (typeof l == "function")
                return t.events.on("gamepadButtonDown", l);
            if (typeof l == "string" && typeof x == "function")
                return t.events.on("gamepadButtonDown", (T) => T === l && x(l));
        }
        o(St, "onGamepadButtonDown");
        function Ct(l, x) {
            if (typeof l == "function")
                return t.events.on("gamepadButtonPress", l);
            if (typeof l == "string" && typeof x == "function")
                return t.events.on(
                    "gamepadButtonPress",
                    (T) => T === l && x(l)
                );
        }
        o(Ct, "onGamepadButtonPress");
        function Tt(l, x) {
            if (typeof l == "function")
                return t.events.on("gamepadButtonRelease", l);
            if (typeof l == "string" && typeof x == "function")
                return t.events.on(
                    "gamepadButtonRelease",
                    (T) => T === l && x(l)
                );
        }
        o(Tt, "onGamepadButtonRelease");
        function At(l, x) {
            return t.events.on("gamepadStick", (T, V) => T === l && x(V));
        }
        o(At, "onGamepadStick");
        function un(l) {
            t.events.on("gamepadConnect", l);
        }
        o(un, "onGamepadConnect");
        function st(l) {
            t.events.on("gamepadDisconnect", l);
        }
        o(st, "onGamepadDisconnect");
        function cn(l) {
            return t.mergedGamepadState.stickState.get(l) || new y(0);
        }
        o(cn, "getGamepadStick");
        function ln() {
            return [...t.charInputted];
        }
        o(ln, "charInputted");
        function rt() {
            return [...t.gamepads];
        }
        o(rt, "getGamepads");
        function hn() {
            t.events.trigger("input"),
                t.keyState.down.forEach((l) => t.events.trigger("keyDown", l)),
                t.mouseState.down.forEach((l) =>
                    t.events.trigger("mouseDown", l)
                ),
                dn();
        }
        o(hn, "processInput");
        function Ot() {
            t.keyState.update(),
                t.mouseState.update(),
                t.mergedGamepadState.buttonState.update(),
                t.mergedGamepadState.stickState.forEach((l, x) => {
                    t.mergedGamepadState.stickState.set(x, new y(0));
                }),
                (t.charInputted = []),
                (t.isMouseMoved = !1),
                t.gamepadStates.forEach((l) => {
                    l.buttonState.update(),
                        l.stickState.forEach((x, T) => {
                            l.stickState.set(T, new y(0));
                        });
                });
        }
        o(Ot, "resetInput");
        function it(l) {
            let x = {
                index: l.index,
                isPressed: (T) =>
                    t.gamepadStates.get(l.index).buttonState.pressed.has(T),
                isDown: (T) =>
                    t.gamepadStates.get(l.index).buttonState.down.has(T),
                isReleased: (T) =>
                    t.gamepadStates.get(l.index).buttonState.released.has(T),
                getStick: (T) => t.gamepadStates.get(l.index).stickState.get(T),
            };
            return (
                t.gamepads.push(x),
                t.gamepadStates.set(l.index, {
                    buttonState: new Qe(),
                    stickState: new Map([
                        ["left", new y(0)],
                        ["right", new y(0)],
                    ]),
                }),
                x
            );
        }
        o(it, "registerGamepad");
        function ot(l) {
            (t.gamepads = t.gamepads.filter((x) => x.index !== l.index)),
                t.gamepadStates.delete(l.index);
        }
        o(ot, "removeGamepad");
        function dn() {
            for (let l of navigator.getGamepads())
                l && !t.gamepadStates.has(l.index) && it(l);
            for (let l of t.gamepads) {
                let x = navigator.getGamepads()[l.index],
                    V = (r.gamepads ?? {})[x.id] ?? In[x.id] ?? In.default,
                    ee = t.gamepadStates.get(l.index);
                for (let z = 0; z < x.buttons.length; z++)
                    x.buttons[z].pressed
                        ? (ee.buttonState.down.has(V.buttons[z]) ||
                              (t.mergedGamepadState.buttonState.press(
                                  V.buttons[z]
                              ),
                              ee.buttonState.press(V.buttons[z]),
                              t.events.trigger(
                                  "gamepadButtonPress",
                                  V.buttons[z]
                              )),
                          t.events.trigger("gamepadButtonDown", V.buttons[z]))
                        : ee.buttonState.down.has(V.buttons[z]) &&
                          (t.mergedGamepadState.buttonState.release(
                              V.buttons[z]
                          ),
                          ee.buttonState.release(V.buttons[z]),
                          t.events.trigger(
                              "gamepadButtonRelease",
                              V.buttons[z]
                          ));
                for (let z in V.sticks) {
                    let Ae = V.sticks[z],
                        at = new y(x.axes[Ae.x], x.axes[Ae.y]);
                    ee.stickState.set(z, at),
                        t.mergedGamepadState.stickState.set(z, at),
                        t.events.trigger("gamepadStick", z, at);
                }
            }
        }
        o(dn, "processGamepad");
        let ce = {},
            me = {},
            Te = {};
        ce.mousemove = (l) => {
            let x = new y(l.offsetX, l.offsetY),
                T = new y(l.movementX, l.movementY);
            t.events.onOnce("input", () => {
                (t.isMouseMoved = !0),
                    (t.mousePos = x),
                    (t.mouseDeltaPos = T),
                    t.events.trigger("mouseMove");
            });
        };
        let Pt = ["left", "middle", "right", "back", "forward"];
        (ce.mousedown = (l) => {
            t.events.onOnce("input", () => {
                let x = Pt[l.button];
                x && (t.mouseState.press(x), t.events.trigger("mousePress", x));
            });
        }),
            (ce.mouseup = (l) => {
                t.events.onOnce("input", () => {
                    let x = Pt[l.button];
                    x &&
                        (t.mouseState.release(x),
                        t.events.trigger("mouseRelease", x));
                });
            });
        let Mt = new Set([
                " ",
                "ArrowLeft",
                "ArrowRight",
                "ArrowUp",
                "ArrowDown",
                "Tab",
            ]),
            Rt = {
                ArrowLeft: "left",
                ArrowRight: "right",
                ArrowUp: "up",
                ArrowDown: "down",
                " ": "space",
            };
        (ce.keydown = (l) => {
            Mt.has(l.key) && l.preventDefault(),
                t.events.onOnce("input", () => {
                    let x = Rt[l.key] || l.key.toLowerCase();
                    x.length === 1
                        ? (t.events.trigger("charInput", x),
                          t.charInputted.push(x))
                        : x === "space" &&
                          (t.events.trigger("charInput", " "),
                          t.charInputted.push(" ")),
                        l.repeat
                            ? (t.keyState.pressRepeat(x),
                              t.events.trigger("keyPressRepeat", x))
                            : (t.keyState.press(x),
                              t.events.trigger("keyPressRepeat", x),
                              t.events.trigger("keyPress", x));
                });
        }),
            (ce.keyup = (l) => {
                t.events.onOnce("input", () => {
                    let x = Rt[l.key] || l.key.toLowerCase();
                    t.keyState.release(x), t.events.trigger("keyRelease", x);
                });
            }),
            (ce.touchstart = (l) => {
                l.preventDefault(),
                    t.events.onOnce("input", () => {
                        let x = [...l.changedTouches],
                            T = t.canvas.getBoundingClientRect();
                        r.touchToMouse !== !1 &&
                            ((t.mousePos = new y(
                                x[0].clientX - T.x,
                                x[0].clientY - T.y
                            )),
                            t.mouseState.press("left"),
                            t.events.trigger("mousePress", "left")),
                            x.forEach((V) => {
                                t.events.trigger(
                                    "touchStart",
                                    new y(V.clientX - T.x, V.clientY - T.y),
                                    V
                                );
                            });
                    });
            }),
            (ce.touchmove = (l) => {
                l.preventDefault(),
                    t.events.onOnce("input", () => {
                        let x = [...l.changedTouches],
                            T = t.canvas.getBoundingClientRect();
                        r.touchToMouse !== !1 &&
                            ((t.mousePos = new y(
                                x[0].clientX - T.x,
                                x[0].clientY - T.y
                            )),
                            t.events.trigger("mouseMove")),
                            x.forEach((V) => {
                                t.events.trigger(
                                    "touchMove",
                                    new y(V.clientX - T.x, V.clientY - T.y),
                                    V
                                );
                            });
                    });
            }),
            (ce.touchend = (l) => {
                t.events.onOnce("input", () => {
                    let x = [...l.changedTouches],
                        T = t.canvas.getBoundingClientRect();
                    r.touchToMouse !== !1 &&
                        ((t.mousePos = new y(
                            x[0].clientX - T.x,
                            x[0].clientY - T.y
                        )),
                        t.mouseState.release("left"),
                        t.events.trigger("mouseRelease", "left")),
                        x.forEach((V) => {
                            t.events.trigger(
                                "touchEnd",
                                new y(V.clientX - T.x, V.clientY - T.y),
                                V
                            );
                        });
                });
            }),
            (ce.touchcancel = (l) => {
                t.events.onOnce("input", () => {
                    let x = [...l.changedTouches],
                        T = t.canvas.getBoundingClientRect();
                    r.touchToMouse !== !1 &&
                        ((t.mousePos = new y(
                            x[0].clientX - T.x,
                            x[0].clientY - T.y
                        )),
                        t.mouseState.release("left"),
                        t.events.trigger("mouseRelease", "left")),
                        x.forEach((V) => {
                            t.events.trigger(
                                "touchEnd",
                                new y(V.clientX - T.x, V.clientY - T.y),
                                V
                            );
                        });
                });
            }),
            (ce.wheel = (l) => {
                l.preventDefault(),
                    t.events.onOnce("input", () => {
                        t.events.trigger("scroll", new y(l.deltaX, l.deltaY));
                    });
            }),
            (ce.contextmenu = (l) => l.preventDefault()),
            (me.visibilitychange = () => {
                document.visibilityState === "visible"
                    ? ((t.skipTime = !0), t.events.trigger("show"))
                    : t.events.trigger("hide");
            }),
            (Te.gamepadconnected = (l) => {
                let x = it(l.gamepad);
                t.events.onOnce("input", () => {
                    t.events.trigger("gamepadConnect", x);
                });
            }),
            (Te.gamepaddisconnected = (l) => {
                let x = rt().filter((T) => T.index === l.gamepad.index)[0];
                ot(l.gamepad),
                    t.events.onOnce("input", () => {
                        t.events.trigger("gamepadDisconnect", x);
                    });
            });
        for (let l in ce) t.canvas.addEventListener(l, ce[l]);
        for (let l in me) document.addEventListener(l, me[l]);
        for (let l in Te) window.addEventListener(l, Te[l]);
        let Dt = new ResizeObserver((l) => {
            for (let x of l)
                if (x.target === t.canvas) {
                    if (
                        t.lastWidth === t.canvas.offsetWidth &&
                        t.lastHeight === t.canvas.offsetHeight
                    )
                        return;
                    (t.lastWidth = t.canvas.offsetWidth),
                        (t.lastHeight = t.canvas.offsetHeight),
                        t.events.onOnce("input", () => {
                            t.events.trigger("resize");
                        });
                }
        });
        return (
            Dt.observe(t.canvas),
            {
                dt: w,
                time: S,
                run: v,
                canvas: c,
                fps: L,
                numFrames: K,
                quit: Ge,
                setFullscreen: O,
                isFullscreen: He,
                setCursor: q,
                screenshot: j,
                getGamepads: rt,
                getCursor: Z,
                setCursorLocked: ue,
                isCursorLocked: U,
                isTouchscreen: le,
                mousePos: pe,
                mouseDeltaPos: ne,
                isKeyDown: Xt,
                isKeyPressed: tt,
                isKeyPressedRepeat: Ce,
                isKeyReleased: nt,
                isMouseDown: ye,
                isMousePressed: re,
                isMouseReleased: k,
                isMouseMoved: A,
                isGamepadButtonPressed: qe,
                isGamepadButtonDown: Wt,
                isGamepadButtonReleased: Jt,
                getGamepadStick: cn,
                charInputted: ln,
                onResize: $e,
                onKeyDown: Qt,
                onKeyPress: Ke,
                onKeyPressRepeat: Zt,
                onKeyRelease: en,
                onMouseDown: yt,
                onMousePress: xt,
                onMouseRelease: Ut,
                onMouseMove: Le,
                onCharInput: tn,
                onTouchStart: nn,
                onTouchMove: sn,
                onTouchEnd: rn,
                onScroll: on,
                onHide: an,
                onShow: Et,
                onGamepadButtonDown: St,
                onGamepadButtonPress: Ct,
                onGamepadButtonRelease: Tt,
                onGamepadStick: At,
                onGamepadConnect: un,
                onGamepadDisconnect: st,
                events: t.events,
            }
        );
    }, "default");
var qt = 2.5949095,
    Ds = 1.70158 + 1,
    Gs = (2 * Math.PI) / 3,
    Fs = (2 * Math.PI) / 4.5,
    $t = {
        linear: (r) => r,
        easeInSine: (r) => 1 - Math.cos((r * Math.PI) / 2),
        easeOutSine: (r) => Math.sin((r * Math.PI) / 2),
        easeInOutSine: (r) => -(Math.cos(Math.PI * r) - 1) / 2,
        easeInQuad: (r) => r * r,
        easeOutQuad: (r) => 1 - (1 - r) * (1 - r),
        easeInOutQuad: (r) =>
            r < 0.5 ? 2 * r * r : 1 - Math.pow(-2 * r + 2, 2) / 2,
        easeInCubic: (r) => r * r * r,
        easeOutCubic: (r) => 1 - Math.pow(1 - r, 3),
        easeInOutCubic: (r) =>
            r < 0.5 ? 4 * r * r * r : 1 - Math.pow(-2 * r + 2, 3) / 2,
        easeInQuart: (r) => r * r * r * r,
        easeOutQuart: (r) => 1 - Math.pow(1 - r, 4),
        easeInOutQuart: (r) =>
            r < 0.5 ? 8 * r * r * r * r : 1 - Math.pow(-2 * r + 2, 4) / 2,
        easeInQuint: (r) => r * r * r * r * r,
        easeOutQuint: (r) => 1 - Math.pow(1 - r, 5),
        easeInOutQuint: (r) =>
            r < 0.5 ? 16 * r * r * r * r * r : 1 - Math.pow(-2 * r + 2, 5) / 2,
        easeInExpo: (r) => (r === 0 ? 0 : Math.pow(2, 10 * r - 10)),
        easeOutExpo: (r) => (r === 1 ? 1 : 1 - Math.pow(2, -10 * r)),
        easeInOutExpo: (r) =>
            r === 0
                ? 0
                : r === 1
                ? 1
                : r < 0.5
                ? Math.pow(2, 20 * r - 10) / 2
                : (2 - Math.pow(2, -20 * r + 10)) / 2,
        easeInCirc: (r) => 1 - Math.sqrt(1 - Math.pow(r, 2)),
        easeOutCirc: (r) => Math.sqrt(1 - Math.pow(r - 1, 2)),
        easeInOutCirc: (r) =>
            r < 0.5
                ? (1 - Math.sqrt(1 - Math.pow(2 * r, 2))) / 2
                : (Math.sqrt(1 - Math.pow(-2 * r + 2, 2)) + 1) / 2,
        easeInBack: (r) => Ds * r * r * r - 1.70158 * r * r,
        easeOutBack: (r) =>
            1 + Ds * Math.pow(r - 1, 3) + 1.70158 * Math.pow(r - 1, 2),
        easeInOutBack: (r) =>
            r < 0.5
                ? (Math.pow(2 * r, 2) * ((qt + 1) * 2 * r - qt)) / 2
                : (Math.pow(2 * r - 2, 2) * ((qt + 1) * (r * 2 - 2) + qt) + 2) /
                  2,
        easeInElastic: (r) =>
            r === 0
                ? 0
                : r === 1
                ? 1
                : -Math.pow(2, 10 * r - 10) * Math.sin((r * 10 - 10.75) * Gs),
        easeOutElastic: (r) =>
            r === 0
                ? 0
                : r === 1
                ? 1
                : Math.pow(2, -10 * r) * Math.sin((r * 10 - 0.75) * Gs) + 1,
        easeInOutElastic: (r) =>
            r === 0
                ? 0
                : r === 1
                ? 1
                : r < 0.5
                ? -(
                      Math.pow(2, 20 * r - 10) *
                      Math.sin((20 * r - 11.125) * Fs)
                  ) / 2
                : (Math.pow(2, -20 * r + 10) *
                      Math.sin((20 * r - 11.125) * Fs)) /
                      2 +
                  1,
        easeInBounce: (r) => 1 - $t.easeOutBounce(1 - r),
        easeOutBounce: (r) =>
            r < 1 / 2.75
                ? 7.5625 * r * r
                : r < 2 / 2.75
                ? 7.5625 * (r -= 1.5 / 2.75) * r + 0.75
                : r < 2.5 / 2.75
                ? 7.5625 * (r -= 2.25 / 2.75) * r + 0.9375
                : 7.5625 * (r -= 2.625 / 2.75) * r + 0.984375,
        easeInOutBounce: (r) =>
            r < 0.5
                ? (1 - $t.easeOutBounce(1 - 2 * r)) / 2
                : (1 + $t.easeOutBounce(2 * r - 1)) / 2,
    },
    Ze = $t;
var bt = class {
    static {
        o(this, "Timer");
    }
    time;
    action;
    finished = !1;
    paused = !1;
    constructor(t, c) {
        (this.time = t), (this.action = c);
    }
    tick(t) {
        return this.finished || this.paused
            ? !1
            : ((this.time -= t),
              this.time <= 0
                  ? (this.action(), (this.finished = !0), (this.time = 0), !0)
                  : !1);
    }
    reset(t) {
        (this.time = t), (this.finished = !1);
    }
};
var Bs =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAA1CAYAAADyMeOEAAAAAXNSR0IArs4c6QAAAoVJREFUaIHdm7txwkAQhheGAqACiCHzOKQDQrqgILpwSAeEDBnEUAF0gCMxZ7G72qce/mec2Lpf9+3unaS78wgSNZ8uX5729+d1FNWXUuGmXlBOUUEIMckEpeQJgBu6C+BSFngztBR2vd+ovY+7g+p6LbgaWgJrAeUkDYIUXgXdBBwNi6kpABJwMTQH3AZsXRR8GHTfgEth8E3gjdAUcNewpbTgY85sCMCUuOokozE0YM0YRzM9NGAAXd8+omAF5h4lnmBRvpSnZHyLoLEbaN+aKB9KWv/KWw0tAbbANnlG+UvB2dm77NxxdwgBpjrF/d7rW9cbmpvio2A5z8iAYpVU8pGZlo6/2+MSco2lHfd3rv9jAP038e1xef9o2mjvYb2OqpqKE81028/jeietlSEVO5FRWsxWsJit1G3aFpW8iWe5RwpiCZAk25QvV6nz6fIlynRGuTd5WqpJ4guAlDfVKBK87hXljflgv1ON6fV+4+5gVlA17SfeG0heKqQd4l4jI/wrmaA9N9R4ar+wpHJDZyrrfcH0nB66PqAzPi76pn+faSyJk/vzOorYhGurQrzj/P68jtBMawHaHBIR9xoD5O34dy0qQOSYHvqExq2TpT2nf76+w7y251OYF0CRaU+J920TwLUa6inx6OxE6g80lu2ux7Y2eJLF/rCXE6zEPdnenk9o+4ih9AEdnW2q81HXl5LuU6OTl2fXUhqganbXAGq3g6jJOWV/OnoesO6YqqEB/GdNsjf7uHtwj2DzmRNpp7iOZfm6D9oAxB6Yi1gC4oIYeo4MIPdopEQRB+cAko5J1tW386HpB2Kz1eop4Epdwls/kgZ1sh8gZsEjdcWkr//D8Qu3Z3l5Nl1NtAAAAABJRU5ErkJggg==";
var Ls = ms(
    "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L5QNSqT5iiySS9Ja2SV//5ME0ak//+4KgAAABgQBAADAMDgYCAEgCteQ0fZH6+ICXA357+MPfhR/+ywRf/U///LVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+5JknQAFoWhGLm5gBClBmT3GiAAAAAGkHAAAIAAANIOAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"
);
var Is =
    "data:image/png;base64,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";
var Vs =
    "data:image/png;base64,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";
var Si = "3000.1.8",
    ks =
        " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
    Kt = "topleft",
    js = 64,
    Ci = "monospace",
    zt = "monospace",
    Ti = 36,
    Ns = 64,
    _s = 256,
    Hs = 2048,
    qs = 2048,
    $s = 2048,
    Ks = 2048,
    zs = 0.1,
    Ai = 64,
    jn = "nearest",
    Oi = 8,
    Pi = 4,
    Ws = [
        { name: "a_pos", size: 2 },
        { name: "a_uv", size: 2 },
        { name: "a_color", size: 4 },
    ],
    Yt = Ws.reduce((r, t) => r + t.size, 0),
    Js = 2048,
    Ys = Js * 4 * Yt,
    Xs = Js * 6,
    Mi = `
attribute vec2 a_pos;
attribute vec2 a_uv;
attribute vec4 a_color;

varying vec2 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

vec4 def_vert() {
	return vec4(a_pos, 0.0, 1.0);
}

{{user}}

void main() {
	vec4 pos = vert(a_pos, a_uv, a_color);
	v_pos = a_pos;
	v_uv = a_uv;
	v_color = a_color;
	gl_Position = pos;
}
`,
    Ri = `
precision mediump float;

varying vec2 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

uniform sampler2D u_tex;

vec4 def_frag() {
	return v_color * texture2D(u_tex, v_uv);
}

{{user}}

void main() {
	gl_FragColor = frag(v_pos, v_uv, v_color, u_tex);
	if (gl_FragColor.a == 0.0) {
		discard;
	}
}
`,
    Nn = `
vec4 vert(vec2 pos, vec2 uv, vec4 color) {
	return def_vert();
}
`,
    _n = `
vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
	return def_frag();
}
`,
    Di = new Set(["id", "require"]),
    Gi = new Set([
        "add",
        "update",
        "draw",
        "destroy",
        "inspect",
        "drawInspect",
    ]);
function et(r) {
    switch (r) {
        case "topleft":
            return new y(-1, -1);
        case "top":
            return new y(0, -1);
        case "topright":
            return new y(1, -1);
        case "left":
            return new y(-1, 0);
        case "center":
            return new y(0, 0);
        case "right":
            return new y(1, 0);
        case "botleft":
            return new y(-1, 1);
        case "bot":
            return new y(0, 1);
        case "botright":
            return new y(1, 1);
        default:
            return r;
    }
}
o(et, "anchorPt");
function Fi(r) {
    switch (r) {
        case "left":
            return 0;
        case "center":
            return 0.5;
        case "right":
            return 1;
        default:
            return 0;
    }
}
o(Fi, "alignPt");
function Bi(r) {
    return r.createBuffer(1, 1, 44100);
}
o(Bi, "createEmptyAudioBuffer");
var po = o((r = {}) => {
    let t = r.root ?? document.body;
    t === document.body &&
        ((document.body.style.width = "100%"),
        (document.body.style.height = "100%"),
        (document.body.style.margin = "0px"),
        (document.documentElement.style.width = "100%"),
        (document.documentElement.style.height = "100%"));
    let c =
            r.canvas ??
            (() => {
                let e = document.createElement("canvas");
                return t.appendChild(e), e;
            })(),
        w = r.scale ?? 1,
        S = r.width && r.height && !r.stretch && !r.letterbox;
    S
        ? ((c.width = r.width * w), (c.height = r.height * w))
        : ((c.width = c.parentElement.offsetWidth),
          (c.height = c.parentElement.offsetHeight));
    let L = c.width,
        K = c.height,
        j = r.pixelDensity || window.devicePixelRatio;
    (c.width *= j), (c.height *= j);
    let q = ["outline: none", "cursor: default"];
    S
        ? (q.push(`width: ${L}px`), q.push(`height: ${K}px`))
        : (q.push("width: 100%"), q.push("height: 100%")),
        r.crisp &&
            (q.push("image-rendering: pixelated"),
            q.push("image-rendering: crisp-edges")),
        (c.style.cssText = q.join(";")),
        (c.tabIndex = 0);
    let Z = document.createElement("canvas");
    (Z.width = _s), (Z.height = _s);
    let ue = Z.getContext("2d", { willReadFrequently: !0 }),
        U = Rs({
            canvas: c,
            touchToMouse: r.touchToMouse,
            gamepads: r.gamepads,
            pixelDensity: r.pixelDensity,
            maxFPS: r.maxFPS,
        }),
        J = [],
        d = U.canvas().getContext("webgl", {
            antialias: !0,
            depth: !0,
            stencil: !0,
            alpha: !0,
            preserveDrawingBuffer: !0,
        });
    class Q {
        static {
            o(this, "Texture");
        }
        src = null;
        glTex;
        width;
        height;
        constructor(n, s, i = {}) {
            (this.glTex = d.createTexture()),
                J.push(() => this.free()),
                this.bind(),
                n &&
                    s &&
                    d.texImage2D(
                        d.TEXTURE_2D,
                        0,
                        d.RGBA,
                        n,
                        s,
                        0,
                        d.RGBA,
                        d.UNSIGNED_BYTE,
                        null
                    ),
                (this.width = n),
                (this.height = s);
            let a = (() => {
                    switch (i.filter ?? r.texFilter) {
                        case "linear":
                            return d.LINEAR;
                        case "nearest":
                            return d.NEAREST;
                        default:
                            return d.NEAREST;
                    }
                })(),
                u = (() => {
                    switch (i.wrap) {
                        case "repeat":
                            return d.REPEAT;
                        case "clampToEdge":
                            return d.CLAMP_TO_EDGE;
                        default:
                            return d.CLAMP_TO_EDGE;
                    }
                })();
            d.texParameteri(d.TEXTURE_2D, d.TEXTURE_MIN_FILTER, a),
                d.texParameteri(d.TEXTURE_2D, d.TEXTURE_MAG_FILTER, a),
                d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_S, u),
                d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_T, u),
                this.unbind();
        }
        static fromImage(n, s = {}) {
            let i = new Q(0, 0, s);
            return (
                i.bind(),
                d.texImage2D(
                    d.TEXTURE_2D,
                    0,
                    d.RGBA,
                    d.RGBA,
                    d.UNSIGNED_BYTE,
                    n
                ),
                (i.width = n.width),
                (i.height = n.height),
                i.unbind(),
                (i.src = n),
                i
            );
        }
        update(n, s = 0, i = 0) {
            this.bind(),
                d.texSubImage2D(
                    d.TEXTURE_2D,
                    0,
                    s,
                    i,
                    d.RGBA,
                    d.UNSIGNED_BYTE,
                    n
                ),
                this.unbind();
        }
        bind() {
            d.bindTexture(d.TEXTURE_2D, this.glTex);
        }
        unbind() {
            d.bindTexture(d.TEXTURE_2D, null);
        }
        free() {
            d.deleteTexture(this.glTex);
        }
    }
    class O extends Error {
        static {
            o(this, "KaboomError");
        }
        constructor(n) {
            super(n), (this.name = "KaboomError");
        }
    }
    class He {
        static {
            o(this, "TexPacker");
        }
        tex;
        canvas;
        ctx;
        x = 0;
        y = 0;
        curHeight = 0;
        constructor(n, s) {
            (this.canvas = document.createElement("canvas")),
                (this.canvas.width = n),
                (this.canvas.height = s),
                (this.tex = Q.fromImage(this.canvas)),
                (this.ctx = this.canvas.getContext("2d"));
        }
        add(n) {
            if (n.width > this.canvas.width || n.height > this.canvas.height)
                throw new O(
                    `Texture size (${n.width} x ${n.height}) exceeds limit (${this.canvas.width} x ${this.canvas.height})`
                );
            this.x + n.width > this.canvas.width &&
                ((this.x = 0),
                (this.y += this.curHeight),
                (this.curHeight = 0)),
                this.y + n.height > this.canvas.height &&
                    (this.ctx.clearRect(
                        0,
                        0,
                        this.canvas.width,
                        this.canvas.height
                    ),
                    (this.tex = Q.fromImage(this.canvas)),
                    (this.x = 0),
                    (this.y = 0),
                    (this.curHeight = 0));
            let s = new y(this.x, this.y);
            return (
                (this.x += n.width),
                n.height > this.curHeight && (this.curHeight = n.height),
                n instanceof ImageData
                    ? this.ctx.putImageData(n, s.x, s.y)
                    : this.ctx.drawImage(n, s.x, s.y),
                this.tex.update(this.canvas),
                [
                    this.tex,
                    new oe(
                        s.x / this.canvas.width,
                        s.y / this.canvas.height,
                        n.width / this.canvas.width,
                        n.height / this.canvas.height
                    ),
                ]
            );
        }
    }
    class Ge {
        static {
            o(this, "FrameBuffer");
        }
        tex;
        glFrameBuffer;
        glRenderBuffer;
        constructor(n, s, i = {}) {
            (this.tex = new Q(n, s, i)),
                (this.glFrameBuffer = d.createFramebuffer()),
                (this.glRenderBuffer = d.createRenderbuffer()),
                J.push(() => this.free()),
                this.bind(),
                d.renderbufferStorage(d.RENDERBUFFER, d.DEPTH_STENCIL, n, s),
                d.framebufferTexture2D(
                    d.FRAMEBUFFER,
                    d.COLOR_ATTACHMENT0,
                    d.TEXTURE_2D,
                    this.tex.glTex,
                    0
                ),
                d.framebufferRenderbuffer(
                    d.FRAMEBUFFER,
                    d.DEPTH_STENCIL_ATTACHMENT,
                    d.RENDERBUFFER,
                    this.glRenderBuffer
                ),
                this.unbind();
        }
        get width() {
            return this.tex.width;
        }
        get height() {
            return this.tex.height;
        }
        bind() {
            d.bindFramebuffer(d.FRAMEBUFFER, this.glFrameBuffer),
                d.bindRenderbuffer(d.RENDERBUFFER, this.glRenderBuffer);
        }
        unbind() {
            d.bindFramebuffer(d.FRAMEBUFFER, null),
                d.bindRenderbuffer(d.RENDERBUFFER, null);
        }
        free() {
            d.deleteFramebuffer(this.glFrameBuffer),
                d.deleteRenderbuffer(this.glRenderBuffer),
                this.tex.free();
        }
    }
    let v = (() => {
        let e = ot(Nn, _n),
            n = Q.fromImage(
                new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1)
            ),
            s =
                r.width && r.height
                    ? new Ge(r.width * j * w, r.height * j * w)
                    : new Ge(d.drawingBufferWidth, d.drawingBufferHeight),
            i = null,
            a = 1;
        r.background &&
            ((i = $.fromArray(r.background)),
            (a = r.background[3] ?? 1),
            d.clearColor(i.r / 255, i.g / 255, i.b / 255, a)),
            d.enable(d.BLEND),
            d.enable(d.SCISSOR_TEST),
            d.blendFuncSeparate(
                d.SRC_ALPHA,
                d.ONE_MINUS_SRC_ALPHA,
                d.ONE,
                d.ONE_MINUS_SRC_ALPHA
            );
        let u = d.createBuffer();
        d.bindBuffer(d.ARRAY_BUFFER, u),
            d.bufferData(d.ARRAY_BUFFER, Ys * 4, d.DYNAMIC_DRAW),
            Ws.reduce(
                (m, h, g) => (
                    d.vertexAttribPointer(g, h.size, d.FLOAT, !1, Yt * 4, m),
                    d.enableVertexAttribArray(g),
                    m + h.size * 4
                ),
                0
            ),
            d.bindBuffer(d.ARRAY_BUFFER, null);
        let f = d.createBuffer();
        d.bindBuffer(d.ELEMENT_ARRAY_BUFFER, f),
            d.bufferData(d.ELEMENT_ARRAY_BUFFER, Xs * 4, d.DYNAMIC_DRAW),
            d.bindBuffer(d.ELEMENT_ARRAY_BUFFER, null);
        let p = Q.fromImage(
            new ImageData(
                new Uint8ClampedArray([
                    128, 128, 128, 255, 190, 190, 190, 255, 190, 190, 190, 255,
                    128, 128, 128, 255,
                ]),
                2,
                2
            ),
            { wrap: "repeat", filter: "nearest" }
        );
        return {
            drawCalls: 0,
            lastDrawCalls: 0,
            defShader: e,
            curShader: e,
            frameBuffer: s,
            postShader: null,
            postShaderUniform: null,
            defTex: n,
            curTex: n,
            curUniform: {},
            vbuf: u,
            ibuf: f,
            vqueue: [],
            iqueue: [],
            transform: new be(),
            transformStack: [],
            bgTex: p,
            bgColor: i,
            bgAlpha: a,
            width: r.width ?? d.drawingBufferWidth / j / w,
            height: r.height ?? d.drawingBufferHeight / j / w,
            viewport: {
                x: 0,
                y: 0,
                width: d.drawingBufferWidth,
                height: d.drawingBufferHeight,
            },
            fixed: !1,
        };
    })();
    class le {
        static {
            o(this, "SpriteData");
        }
        tex;
        frames = [new oe(0, 0, 1, 1)];
        anims = {};
        slice9 = null;
        constructor(n, s, i = {}, a = null) {
            (this.tex = n),
                s && (this.frames = s),
                (this.anims = i),
                (this.slice9 = a);
        }
        get width() {
            return this.tex.width * this.frames[0].w;
        }
        get height() {
            return this.tex.height * this.frames[0].h;
        }
        static from(n, s = {}) {
            return typeof n == "string"
                ? le.fromURL(n, s)
                : Promise.resolve(le.fromImage(n, s));
        }
        static fromImage(n, s = {}) {
            let [i, a] = k.packer.add(n),
                u = s.frames
                    ? s.frames.map(
                          (f) =>
                              new oe(
                                  a.x + f.x * a.w,
                                  a.y + f.y * a.h,
                                  f.w * a.w,
                                  f.h * a.h
                              )
                      )
                    : yt(s.sliceX || 1, s.sliceY || 1, a.x, a.y, a.w, a.h);
            return new le(i, u, s.anims, s.slice9);
        }
        static fromURL(n, s = {}) {
            return $e(n).then((i) => le.fromImage(i, s));
        }
    }
    class pe {
        static {
            o(this, "SoundData");
        }
        buf;
        constructor(n) {
            this.buf = n;
        }
        static fromArrayBuffer(n) {
            return new Promise((s, i) => ne.ctx.decodeAudioData(n, s, i)).then(
                (s) => new pe(s)
            );
        }
        static fromURL(n) {
            return Ln(n)
                ? pe.fromArrayBuffer(As(n))
                : Jt(n).then((s) => pe.fromArrayBuffer(s));
        }
    }
    let ne = (() => {
        let e = new (window.AudioContext || window.webkitAudioContext)(),
            n = e.createGain();
        n.connect(e.destination);
        let s = new pe(Bi(e));
        return (
            e
                .decodeAudioData(Ls.buffer.slice(0))
                .then((i) => {
                    s.buf = i;
                })
                .catch((i) => {
                    console.error("Failed to load burp: ", i);
                }),
            { ctx: e, masterNode: n, burpSnd: s }
        );
    })();
    class re {
        static {
            o(this, "Asset");
        }
        loaded = !1;
        data = null;
        error = null;
        onLoadEvents = new ve();
        onErrorEvents = new ve();
        onFinishEvents = new ve();
        constructor(n) {
            n.then((s) => {
                (this.data = s), this.onLoadEvents.trigger(s);
            })
                .catch((s) => {
                    if (
                        ((this.error = s),
                        this.onErrorEvents.numListeners() > 0)
                    )
                        this.onErrorEvents.trigger(s);
                    else throw s;
                })
                .finally(() => {
                    this.onFinishEvents.trigger(), (this.loaded = !0);
                });
        }
        static loaded(n) {
            let s = new re(Promise.resolve(n));
            return (s.data = n), (s.loaded = !0), s;
        }
        onLoad(n) {
            return (
                this.loaded && this.data
                    ? n(this.data)
                    : this.onLoadEvents.add(n),
                this
            );
        }
        onError(n) {
            return (
                this.loaded && this.error
                    ? n(this.error)
                    : this.onErrorEvents.add(n),
                this
            );
        }
        onFinish(n) {
            return this.loaded ? n() : this.onFinishEvents.add(n), this;
        }
        then(n) {
            return this.onLoad(n);
        }
        catch(n) {
            return this.onError(n);
        }
        finally(n) {
            return this.onFinish(n);
        }
    }
    class ye {
        static {
            o(this, "AssetBucket");
        }
        assets = new Map();
        lastUID = 0;
        add(n, s) {
            let i = n ?? this.lastUID++ + "",
                a = new re(s);
            return this.assets.set(i, a), a;
        }
        addLoaded(n, s) {
            let i = n ?? this.lastUID++ + "",
                a = re.loaded(s);
            return this.assets.set(i, a), a;
        }
        get(n) {
            return this.assets.get(n);
        }
        progress() {
            if (this.assets.size === 0) return 1;
            let n = 0;
            return (
                this.assets.forEach((s) => {
                    s.loaded && n++;
                }),
                n / this.assets.size
            );
        }
    }
    let k = {
            urlPrefix: "",
            sprites: new ye(),
            fonts: new ye(),
            bitmapFonts: new ye(),
            sounds: new ye(),
            shaders: new ye(),
            custom: new ye(),
            packer: new He($s, Ks),
            loaded: !1,
        },
        A = {
            events: new De(),
            objEvents: new De(),
            root: mn([]),
            gravity: 0,
            scenes: {},
            logs: [],
            cam: {
                pos: null,
                scale: new y(1),
                angle: 0,
                shake: 0,
                transform: new be(),
            },
        };
    function tt(e) {
        return k.custom.add(null, e);
    }
    o(tt, "load");
    function Ce() {
        let e = [
            k.sprites,
            k.sounds,
            k.shaders,
            k.fonts,
            k.bitmapFonts,
            k.custom,
        ];
        return e.reduce((n, s) => n + s.progress(), 0) / e.length;
    }
    o(Ce, "loadProgress");
    function Xt(e) {
        return e !== void 0 && (k.urlPrefix = e), k.urlPrefix;
    }
    o(Xt, "loadRoot");
    function nt(e) {
        let n = k.urlPrefix + e;
        return fetch(n).then((s) => {
            if (!s.ok) throw new O(`Failed to fetch "${n}"`);
            return s;
        });
    }
    o(nt, "fetchURL");
    function qe(e) {
        return nt(e).then((n) => n.json());
    }
    o(qe, "fetchJSON");
    function Wt(e) {
        return nt(e).then((n) => n.text());
    }
    o(Wt, "fetchText");
    function Jt(e) {
        return nt(e).then((n) => n.arrayBuffer());
    }
    o(Jt, "fetchArrayBuffer");
    function $e(e) {
        let n = new Image();
        return (
            (n.crossOrigin = "anonymous"),
            (n.src = Ln(e) ? e : k.urlPrefix + e),
            new Promise((s, i) => {
                (n.onload = () => s(n)),
                    (n.onerror = () =>
                        i(new O(`Failed to load image from "${e}"`)));
            })
        );
    }
    o($e, "loadImg");
    function Qt(e, n) {
        return k.custom.add(e, qe(n));
    }
    o(Qt, "loadJSON");
    class Ke {
        static {
            o(this, "FontData");
        }
        fontface;
        filter = jn;
        outline = null;
        constructor(n, s = {}) {
            (this.fontface = n),
                (this.filter = s.filter ?? jn),
                s.outline &&
                    ((this.outline = { width: 1, color: W(0, 0, 0) }),
                    typeof s.outline == "number"
                        ? (this.outline.width = s.outline)
                        : typeof s.outline == "object" &&
                          (s.outline.width &&
                              (this.outline.width = s.outline.width),
                          s.outline.color &&
                              (this.outline.color = s.outline.color)));
        }
    }
    function Zt(e, n, s = {}) {
        let i = new FontFace(e, typeof n == "string" ? `url(${n})` : n);
        return (
            document.fonts.add(i),
            k.fonts.add(
                e,
                i
                    .load()
                    .catch((a) => {
                        throw new O(`Failed to load font from "${n}": ${a}`);
                    })
                    .then((a) => new Ke(a, s))
            )
        );
    }
    o(Zt, "loadFont");
    function en(e, n, s, i, a = {}) {
        return k.bitmapFonts.add(
            e,
            $e(n).then((u) => dn(Q.fromImage(u, a), s, i, a.chars ?? ks))
        );
    }
    o(en, "loadBitmapFont");
    function yt(e = 1, n = 1, s = 0, i = 0, a = 1, u = 1) {
        let f = [],
            p = a / e,
            m = u / n;
        for (let h = 0; h < n; h++)
            for (let g = 0; g < e; g++)
                f.push(new oe(s + g * p, i + h * m, p, m));
        return f;
    }
    o(yt, "slice");
    function xt(e, n) {
        return tt(
            typeof n == "string"
                ? new Promise((s, i) => {
                      qe(n).then((a) => {
                          xt(e, a).then(s).catch(i);
                      });
                  })
                : le.from(e).then((s) => {
                      let i = {};
                      for (let a in n) {
                          let u = n[a],
                              f = s.frames[0],
                              p = $s * f.w,
                              m = Ks * f.h,
                              h = u.frames
                                  ? u.frames.map(
                                        (E) =>
                                            new oe(
                                                f.x + ((u.x + E.x) / p) * f.w,
                                                f.y + ((u.y + E.y) / m) * f.h,
                                                (E.w / p) * f.w,
                                                (E.h / m) * f.h
                                            )
                                    )
                                  : yt(
                                        u.sliceX || 1,
                                        u.sliceY || 1,
                                        f.x + (u.x / p) * f.w,
                                        f.y + (u.y / m) * f.h,
                                        (u.width / p) * f.w,
                                        (u.height / m) * f.h
                                    ),
                              g = new le(s.tex, h, u.anims);
                          k.sprites.addLoaded(a, g), (i[a] = g);
                      }
                      return i;
                  })
        );
    }
    o(xt, "loadSpriteAtlas");
    function Ut(e, n = {}) {
        let s = document.createElement("canvas"),
            i = e[0].width,
            a = e[0].height;
        (s.width = i * e.length), (s.height = a);
        let u = s.getContext("2d");
        e.forEach((p, m) => {
            p instanceof ImageData
                ? u.putImageData(p, m * i, 0)
                : u.drawImage(p, m * i, 0);
        });
        let f = u.getImageData(0, 0, e.length * i, a);
        return le.fromImage(f, { ...n, sliceX: e.length, sliceY: 1 });
    }
    o(Ut, "createSpriteSheet");
    function Le(e, n, s = { sliceX: 1, sliceY: 1, anims: {} }) {
        return Array.isArray(n)
            ? n.some((i) => typeof i == "string")
                ? k.sprites.add(
                      e,
                      Promise.all(
                          n.map((i) =>
                              typeof i == "string" ? $e(i) : Promise.resolve(i)
                          )
                      ).then((i) => Ut(i, s))
                  )
                : k.sprites.addLoaded(e, Ut(n, s))
            : typeof n == "string"
            ? k.sprites.add(e, le.from(n, s))
            : k.sprites.addLoaded(e, le.fromImage(n, s));
    }
    o(Le, "loadSprite");
    function tn(e, n) {
        return k.sprites.add(
            e,
            new Promise(async (s) => {
                let i = typeof n == "string" ? await qe(n) : n,
                    a = await Promise.all(i.frames.map($e)),
                    u = document.createElement("canvas");
                (u.width = i.width), (u.height = i.height * i.frames.length);
                let f = u.getContext("2d");
                a.forEach((m, h) => {
                    f.drawImage(m, 0, h * i.height);
                });
                let p = await Le(null, u, {
                    sliceY: i.frames.length,
                    anims: i.anims,
                });
                s(p);
            })
        );
    }
    o(tn, "loadPedit");
    function nn(e, n, s) {
        typeof n == "string" &&
            !s &&
            (s = n.replace(new RegExp(`${Ps(n)}$`), "json"));
        let i = typeof s == "string" ? qe(s) : Promise.resolve(s);
        return k.sprites.add(
            e,
            i.then((a) => {
                let u = a.meta.size,
                    f = a.frames.map(
                        (m) =>
                            new oe(
                                m.frame.x / u.w,
                                m.frame.y / u.h,
                                m.frame.w / u.w,
                                m.frame.h / u.h
                            )
                    ),
                    p = {};
                for (let m of a.meta.frameTags)
                    m.from === m.to
                        ? (p[m.name] = m.from)
                        : (p[m.name] = {
                              from: m.from,
                              to: m.to,
                              speed: 10,
                              loop: !0,
                              pingpong: m.direction === "pingpong",
                          });
                return le.from(n, { frames: f, anims: p });
            })
        );
    }
    o(nn, "loadAseprite");
    function sn(e, n, s) {
        return k.shaders.addLoaded(e, ot(n, s));
    }
    o(sn, "loadShader");
    function rn(e, n, s) {
        let i = o((u) => (u ? Wt(u) : Promise.resolve(null)), "resolveUrl"),
            a = Promise.all([i(n), i(s)]).then(([u, f]) => ot(u, f));
        return k.shaders.add(e, a);
    }
    o(rn, "loadShaderURL");
    function on(e, n) {
        return k.sounds.add(
            e,
            typeof n == "string" ? pe.fromURL(n) : pe.fromArrayBuffer(n)
        );
    }
    o(on, "loadSound");
    function an(e = "bean") {
        return Le(e, Bs);
    }
    o(an, "loadBean");
    function Et(e) {
        return k.sprites.get(e);
    }
    o(Et, "getSprite");
    function St(e) {
        return k.sounds.get(e);
    }
    o(St, "getSound");
    function Ct(e) {
        return k.fonts.get(e);
    }
    o(Ct, "getFont");
    function Tt(e) {
        return k.bitmapFonts.get(e);
    }
    o(Tt, "getBitmapFont");
    function At(e) {
        return k.shaders.get(e);
    }
    o(At, "getShader");
    function un(e) {
        return k.custom.get(e);
    }
    o(un, "getAsset");
    function st(e) {
        if (typeof e == "string") {
            let n = Et(e);
            if (n) return n;
            if (Ce() < 1) return null;
            throw new O(`Sprite not found: ${e}`);
        } else {
            if (e instanceof le) return re.loaded(e);
            if (e instanceof re) return e;
            throw new O(`Invalid sprite: ${e}`);
        }
    }
    o(st, "resolveSprite");
    function cn(e) {
        if (typeof e == "string") {
            let n = St(e);
            if (n) return n;
            if (Ce() < 1) return null;
            throw new O(`Sound not found: ${e}`);
        } else {
            if (e instanceof pe) return re.loaded(e);
            if (e instanceof re) return e;
            throw new O(`Invalid sound: ${e}`);
        }
    }
    o(cn, "resolveSound");
    function ln(e) {
        if (!e) return v.defShader;
        if (typeof e == "string") {
            let n = At(e);
            if (n) return n.data ?? n;
            if (Ce() < 1) return null;
            throw new O(`Shader not found: ${e}`);
        } else if (e instanceof re) return e.data ? e.data : e;
        return e;
    }
    o(ln, "resolveShader");
    function rt(e) {
        if (!e) return rt(r.font ?? Ci);
        if (typeof e == "string") {
            let n = Tt(e),
                s = Ct(e);
            if (n) return n.data ?? n;
            if (s) return s.data ?? s;
            if (document.fonts.check(`${Ns}px ${e}`)) return e;
            if (Ce() < 1) return null;
            throw new O(`Font not found: ${e}`);
        } else if (e instanceof re) return e.data ? e.data : e;
        return e;
    }
    o(rt, "resolveFont");
    function hn(e) {
        return (
            e !== void 0 && (ne.masterNode.gain.value = e),
            ne.masterNode.gain.value
        );
    }
    o(hn, "volume");
    function Ot(e, n = {}) {
        let s = ne.ctx,
            i = n.paused ?? !1,
            a = s.createBufferSource(),
            u = new ve(),
            f = s.createGain(),
            p = n.seek ?? 0,
            m = 0,
            h = 0,
            g = !1;
        (a.loop = !!n.loop),
            (a.detune.value = n.detune ?? 0),
            (a.playbackRate.value = n.speed ?? 1),
            a.connect(f),
            (a.onended = () => {
                F() >= a.buffer?.duration && u.trigger();
            }),
            f.connect(ne.masterNode),
            (f.gain.value = n.volume ?? 1);
        let E = o((D) => {
                (a.buffer = D.buf),
                    i || ((m = s.currentTime), a.start(0, p), (g = !0));
            }, "start"),
            M = cn(e);
        M instanceof re && M.onLoad(E);
        let F = o(() => {
                if (!a.buffer) return 0;
                let D = i ? h - m : s.currentTime - m,
                    P = a.buffer.duration;
                return a.loop ? D % P : Math.min(D, P);
            }, "getTime"),
            _ = o((D) => {
                let P = s.createBufferSource();
                return (
                    (P.buffer = D.buffer),
                    (P.loop = D.loop),
                    (P.playbackRate.value = D.playbackRate.value),
                    (P.detune.value = D.detune.value),
                    (P.onended = D.onended),
                    P.connect(f),
                    P
                );
            }, "cloneNode");
        return {
            stop() {
                (this.paused = !0), this.seek(0);
            },
            set paused(D) {
                if (i !== D)
                    if (((i = D), D))
                        g && (a.stop(), (g = !1)), (h = s.currentTime);
                    else {
                        a = _(a);
                        let P = h - m;
                        a.start(0, P),
                            (g = !0),
                            (m = s.currentTime - P),
                            (h = 0);
                    }
            },
            get paused() {
                return i;
            },
            play(D = 0) {
                this.seek(D), (this.paused = !1);
            },
            seek(D) {
                a.buffer?.duration &&
                    (D > a.buffer.duration ||
                        (i
                            ? ((a = _(a)), (m = h - D))
                            : (a.stop(),
                              (a = _(a)),
                              (m = s.currentTime - D),
                              a.start(0, D),
                              (g = !0),
                              (h = 0))));
            },
            set speed(D) {
                a.playbackRate.value = D;
            },
            get speed() {
                return a.playbackRate.value;
            },
            set detune(D) {
                a.detune.value = D;
            },
            get detune() {
                return a.detune.value;
            },
            set volume(D) {
                f.gain.value = Math.max(D, 0);
            },
            get volume() {
                return f.gain.value;
            },
            set loop(D) {
                a.loop = D;
            },
            get loop() {
                return a.loop;
            },
            duration() {
                return a.buffer?.duration ?? 0;
            },
            time() {
                return F() % this.duration();
            },
            onEnd(D) {
                return u.add(D);
            },
            then(D) {
                return this.onEnd(D);
            },
        };
    }
    o(Ot, "play");
    function it(e) {
        return Ot(ne.burpSnd, e);
    }
    o(it, "burp");
    function ot(e = Nn, n = _n) {
        let s = Mi.replace("{{user}}", e ?? Nn),
            i = Ri.replace("{{user}}", n ?? _n),
            a = d.createShader(d.VERTEX_SHADER),
            u = d.createShader(d.FRAGMENT_SHADER);
        d.shaderSource(a, s),
            d.shaderSource(u, i),
            d.compileShader(a),
            d.compileShader(u);
        let f = d.createProgram();
        if (
            (J.push(() => d.deleteProgram(f)),
            d.attachShader(f, a),
            d.attachShader(f, u),
            d.bindAttribLocation(f, 0, "a_pos"),
            d.bindAttribLocation(f, 1, "a_uv"),
            d.bindAttribLocation(f, 2, "a_color"),
            d.linkProgram(f),
            !d.getProgramParameter(f, d.LINK_STATUS))
        ) {
            let p = o((E) => {
                    let M = /^ERROR:\s0:(?<line>\d+):\s(?<msg>.+)/,
                        F = E.match(M);
                    return {
                        line: Number(F.groups.line),
                        msg: F.groups.msg.replace(/\n\0$/, ""),
                    };
                }, "formatShaderError"),
                m = d.getShaderInfoLog(a),
                h = d.getShaderInfoLog(u),
                g = "";
            if (m) {
                let E = p(m);
                g += `Vertex shader line ${E.line - 14}: ${E.msg}`;
            }
            if (h) {
                let E = p(h);
                g += `Fragment shader line ${E.line - 14}: ${E.msg}`;
            }
            throw new O(g);
        }
        return (
            d.deleteShader(a),
            d.deleteShader(u),
            {
                bind() {
                    d.useProgram(f);
                },
                unbind() {
                    d.useProgram(null);
                },
                free() {
                    d.deleteProgram(f);
                },
                send(p) {
                    for (let m in p) {
                        let h = p[m],
                            g = d.getUniformLocation(f, m);
                        typeof h == "number"
                            ? d.uniform1f(g, h)
                            : h instanceof be
                            ? d.uniformMatrix4fv(g, !1, new Float32Array(h.m))
                            : h instanceof $
                            ? d.uniform3f(g, h.r, h.g, h.b)
                            : h instanceof y && d.uniform2f(g, h.x, h.y);
                    }
                },
            }
        );
    }
    o(ot, "makeShader");
    function dn(e, n, s, i) {
        let a = e.width / n,
            u = {},
            f = i.split("").entries();
        for (let [p, m] of f)
            u[m] = new oe((p % a) * n, Math.floor(p / a) * s, n, s);
        return { tex: e, map: u, size: s };
    }
    o(dn, "makeFont");
    function ce(e, n, s, i = v.defTex, a = v.defShader, u = {}) {
        let f = ln(a);
        if (!f || f instanceof re) return;
        (i !== v.curTex ||
            f !== v.curShader ||
            !Gn(v.curUniform, u) ||
            v.vqueue.length + e.length * Yt > Ys ||
            v.iqueue.length + n.length > Xs) &&
            me();
        let p = v.fixed || s ? v.transform : A.cam.transform.mult(v.transform);
        for (let m of e) {
            let h = Rt(p.multVec2(m.pos));
            v.vqueue.push(
                h.x,
                h.y,
                m.uv.x,
                m.uv.y,
                m.color.r / 255,
                m.color.g / 255,
                m.color.b / 255,
                m.opacity
            );
        }
        for (let m of n) v.iqueue.push(m + v.vqueue.length / Yt - e.length);
        (v.curTex = i), (v.curShader = f), (v.curUniform = u);
    }
    o(ce, "drawRaw");
    function me() {
        !v.curTex ||
            !v.curShader ||
            v.vqueue.length === 0 ||
            v.iqueue.length === 0 ||
            (d.bindBuffer(d.ARRAY_BUFFER, v.vbuf),
            d.bufferSubData(d.ARRAY_BUFFER, 0, new Float32Array(v.vqueue)),
            d.bindBuffer(d.ELEMENT_ARRAY_BUFFER, v.ibuf),
            d.bufferSubData(
                d.ELEMENT_ARRAY_BUFFER,
                0,
                new Uint16Array(v.iqueue)
            ),
            v.curShader.bind(),
            v.curShader.send(v.curUniform),
            v.curTex.bind(),
            d.drawElements(d.TRIANGLES, v.iqueue.length, d.UNSIGNED_SHORT, 0),
            v.curTex.unbind(),
            v.curShader.unbind(),
            d.bindBuffer(d.ARRAY_BUFFER, null),
            d.bindBuffer(d.ELEMENT_ARRAY_BUFFER, null),
            (v.vqueue.length = 0),
            (v.iqueue.length = 0),
            v.drawCalls++);
    }
    o(me, "flush");
    function Te() {
        d.clear(d.COLOR_BUFFER_BIT),
            v.frameBuffer.bind(),
            d.viewport(0, 0, v.frameBuffer.width, v.frameBuffer.height),
            d.clear(d.COLOR_BUFFER_BIT),
            v.bgColor ||
                Fe(() => {
                    z({
                        width: ge(),
                        height: we(),
                        quad: new oe(0, 0, ge() / js, we() / js),
                        tex: v.bgTex,
                        fixed: !0,
                    });
                }),
            (v.drawCalls = 0),
            (v.fixed = !1),
            (v.transformStack.length = 0),
            (v.transform = new be());
    }
    o(Te, "frameStart");
    function Pt(e, n) {
        (v.postShader = e), (v.postShaderUniform = n ?? null);
    }
    o(Pt, "usePostEffect");
    function Mt() {
        me(),
            v.frameBuffer.unbind(),
            d.viewport(0, 0, d.drawingBufferWidth, d.drawingBufferHeight),
            me();
        let e = v.width,
            n = v.height;
        (v.width = d.drawingBufferWidth / j),
            (v.height = d.drawingBufferHeight / j),
            Ae({
                flipY: !0,
                tex: v.frameBuffer.tex,
                pos: new y(v.viewport.x, v.viewport.y),
                width: v.viewport.width,
                height: v.viewport.height,
                shader: v.postShader,
                uniform:
                    typeof v.postShaderUniform == "function"
                        ? v.postShaderUniform()
                        : v.postShaderUniform,
                fixed: !0,
            }),
            me(),
            (v.width = e),
            (v.height = n),
            (v.lastDrawCalls = v.drawCalls);
    }
    o(Mt, "frameEnd");
    function Rt(e) {
        return new y((e.x / ge()) * 2 - 1, (-e.y / we()) * 2 + 1);
    }
    o(Rt, "screen2ndc");
    function Dt(e) {
        v.transform = e.clone();
    }
    o(Dt, "pushMatrix");
    function l(...e) {
        if (e[0] === void 0) return;
        let n = C(...e);
        (n.x === 0 && n.y === 0) || v.transform.translate(n);
    }
    o(l, "pushTranslate");
    function x(...e) {
        if (e[0] === void 0) return;
        let n = C(...e);
        (n.x === 1 && n.y === 1) || v.transform.scale(n);
    }
    o(x, "pushScale");
    function T(e) {
        e && v.transform.rotate(e);
    }
    o(T, "pushRotate");
    function V() {
        v.transformStack.push(v.transform.clone());
    }
    o(V, "pushTransform");
    function ee() {
        v.transformStack.length > 0 && (v.transform = v.transformStack.pop());
    }
    o(ee, "popTransform");
    function z(e) {
        if (e.width === void 0 || e.height === void 0)
            throw new O('drawUVQuad() requires property "width" and "height".');
        if (e.width <= 0 || e.height <= 0) return;
        let n = e.width,
            s = e.height,
            a = et(e.anchor || Kt).scale(new y(n, s).scale(-0.5)),
            u = e.quad || new oe(0, 0, 1, 1),
            f = e.color || W(255, 255, 255),
            p = e.opacity ?? 1,
            m = e.tex ? zs / e.tex.width : 0,
            h = e.tex ? zs / e.tex.height : 0,
            g = u.x + m,
            E = u.y + h,
            M = u.w - m * 2,
            F = u.h - h * 2;
        V(),
            l(e.pos),
            T(e.angle),
            x(e.scale),
            l(a),
            ce(
                [
                    {
                        pos: new y(-n / 2, s / 2),
                        uv: new y(e.flipX ? g + M : g, e.flipY ? E : E + F),
                        color: f,
                        opacity: p,
                    },
                    {
                        pos: new y(-n / 2, -s / 2),
                        uv: new y(e.flipX ? g + M : g, e.flipY ? E + F : E),
                        color: f,
                        opacity: p,
                    },
                    {
                        pos: new y(n / 2, -s / 2),
                        uv: new y(e.flipX ? g : g + M, e.flipY ? E + F : E),
                        color: f,
                        opacity: p,
                    },
                    {
                        pos: new y(n / 2, s / 2),
                        uv: new y(e.flipX ? g : g + M, e.flipY ? E : E + F),
                        color: f,
                        opacity: p,
                    },
                ],
                [0, 1, 3, 1, 2, 3],
                e.fixed,
                e.tex,
                e.shader,
                e.uniform
            ),
            ee();
    }
    o(z, "drawUVQuad");
    function Ae(e) {
        if (!e.tex) throw new O('drawTexture() requires property "tex".');
        let n = e.quad ?? new oe(0, 0, 1, 1),
            s = e.tex.width * n.w,
            i = e.tex.height * n.h,
            a = new y(1);
        if (e.tiled) {
            let u = Math.ceil((e.width || s) / s),
                f = Math.ceil((e.height || i) / i),
                m = et(e.anchor || Kt)
                    .add(new y(1, 1))
                    .scale(0.5)
                    .scale(u * s, f * i);
            for (let h = 0; h < u; h++)
                for (let g = 0; g < f; g++)
                    z(
                        Object.assign({}, e, {
                            pos: (e.pos || new y(0))
                                .add(new y(s * h, i * g))
                                .sub(m),
                            scale: a.scale(e.scale || new y(1)),
                            tex: e.tex,
                            quad: n,
                            width: s,
                            height: i,
                            anchor: "topleft",
                        })
                    );
        } else
            e.width && e.height
                ? ((a.x = e.width / s), (a.y = e.height / i))
                : e.width
                ? ((a.x = e.width / s), (a.y = a.x))
                : e.height && ((a.y = e.height / i), (a.x = a.y)),
                z(
                    Object.assign({}, e, {
                        scale: a.scale(e.scale || new y(1)),
                        tex: e.tex,
                        quad: n,
                        width: s,
                        height: i,
                    })
                );
    }
    o(Ae, "drawTexture");
    function at(e) {
        if (!e.sprite) throw new O('drawSprite() requires property "sprite"');
        let n = st(e.sprite);
        if (!n || !n.data) return;
        let s = n.data.frames[e.frame ?? 0];
        if (!s) throw new O(`Frame not found: ${e.frame ?? 0}`);
        Ae(
            Object.assign({}, e, {
                tex: n.data.tex,
                quad: s.scale(e.quad ?? new oe(0, 0, 1, 1)),
            })
        );
    }
    o(at, "drawSprite");
    function ut(e, n, s, i, a, u = 1) {
        (i = Ee(i % 360)), (a = Ee(a % 360)), a <= i && (a += Math.PI * 2);
        let f = [],
            p = Math.ceil(((a - i) / Ee(8)) * u),
            m = (a - i) / p;
        for (let h = i; h < a; h += m)
            f.push(e.add(n * Math.cos(h), s * Math.sin(h)));
        return f.push(e.add(n * Math.cos(a), s * Math.sin(a))), f;
    }
    o(ut, "getArcPts");
    function xe(e) {
        if (e.width === void 0 || e.height === void 0)
            throw new O('drawRect() requires property "width" and "height".');
        if (e.width <= 0 || e.height <= 0) return;
        let n = e.width,
            s = e.height,
            a = et(e.anchor || Kt)
                .add(1, 1)
                .scale(new y(n, s).scale(-0.5)),
            u = [new y(0, 0), new y(n, 0), new y(n, s), new y(0, s)];
        if (e.radius) {
            let f = Math.min(Math.min(n, s) / 2, e.radius);
            u = [
                new y(f, 0),
                new y(n - f, 0),
                ...ut(new y(n - f, f), f, f, 270, 360),
                new y(n, f),
                new y(n, s - f),
                ...ut(new y(n - f, s - f), f, f, 0, 90),
                new y(n - f, s),
                new y(f, s),
                ...ut(new y(f, s - f), f, f, 90, 180),
                new y(0, s - f),
                new y(0, f),
                ...ut(new y(f, f), f, f, 180, 270),
            ];
        }
        Ie(
            Object.assign({}, e, {
                offset: a,
                pts: u,
                ...(e.gradient
                    ? {
                          colors: e.horizontal
                              ? [
                                    e.gradient[0],
                                    e.gradient[1],
                                    e.gradient[1],
                                    e.gradient[0],
                                ]
                              : [
                                    e.gradient[0],
                                    e.gradient[0],
                                    e.gradient[1],
                                    e.gradient[1],
                                ],
                      }
                    : {}),
            })
        );
    }
    o(xe, "drawRect");
    function ct(e) {
        let { p1: n, p2: s } = e;
        if (!n || !s)
            throw new O('drawLine() requires properties "p1" and "p2".');
        let i = e.width || 1,
            a = s
                .sub(n)
                .unit()
                .normal()
                .scale(i * 0.5),
            u = [n.sub(a), n.add(a), s.add(a), s.sub(a)].map((f) => ({
                pos: new y(f.x, f.y),
                uv: new y(0),
                color: e.color ?? $.WHITE,
                opacity: e.opacity ?? 1,
            }));
        ce(u, [0, 1, 3, 1, 2, 3], e.fixed, v.defTex, e.shader, e.uniform);
    }
    o(ct, "drawLine");
    function Hn(e) {
        let n = e.pts;
        if (!n) throw new O('drawLines() requires property "pts".');
        if (!(n.length < 2))
            if (e.radius && n.length >= 3) {
                let s = n[0].sdist(n[1]);
                for (let a = 1; a < n.length - 1; a++)
                    s = Math.min(n[a].sdist(n[a + 1]), s);
                let i = Math.min(e.radius, Math.sqrt(s) / 2);
                ct(Object.assign({}, e, { p1: n[0], p2: n[1] }));
                for (let a = 1; a < n.length - 2; a++) {
                    let u = n[a],
                        f = n[a + 1];
                    ct(Object.assign({}, e, { p1: u, p2: f }));
                }
                ct(
                    Object.assign({}, e, {
                        p1: n[n.length - 2],
                        p2: n[n.length - 1],
                    })
                );
            } else
                for (let s = 0; s < n.length - 1; s++)
                    ct(Object.assign({}, e, { p1: n[s], p2: n[s + 1] })),
                        e.join !== "none" &&
                            ze(
                                Object.assign({}, e, {
                                    pos: n[s],
                                    radius: e.width / 2,
                                })
                            );
    }
    o(Hn, "drawLines");
    function qn(e) {
        if (!e.p1 || !e.p2 || !e.p3)
            throw new O(
                'drawPolygon() requires properties "p1", "p2" and "p3".'
            );
        return Ie(Object.assign({}, e, { pts: [e.p1, e.p2, e.p3] }));
    }
    o(qn, "drawTriangle");
    function ze(e) {
        if (typeof e.radius != "number")
            throw new O('drawCircle() requires property "radius".');
        e.radius !== 0 &&
            $n(
                Object.assign({}, e, {
                    radiusX: e.radius,
                    radiusY: e.radius,
                    angle: 0,
                })
            );
    }
    o(ze, "drawCircle");
    function $n(e) {
        if (e.radiusX === void 0 || e.radiusY === void 0)
            throw new O(
                'drawEllipse() requires properties "radiusX" and "radiusY".'
            );
        if (e.radiusX === 0 || e.radiusY === 0) return;
        let n = e.start ?? 0,
            s = e.end ?? 360,
            i = et(e.anchor ?? "center").scale(new y(-e.radiusX, -e.radiusY)),
            a = ut(i, e.radiusX, e.radiusY, n, s, e.resolution);
        a.unshift(i);
        let u = Object.assign({}, e, {
            pts: a,
            radius: 0,
            ...(e.gradient
                ? {
                      colors: [
                          e.gradient[0],
                          ...Array(a.length - 1).fill(e.gradient[1]),
                      ],
                  }
                : {}),
        });
        if (s - n >= 360 && e.outline) {
            e.fill !== !1 && Ie(Object.assign(u, { outline: null })),
                Ie(Object.assign(u, { pts: a.slice(1), fill: !1 }));
            return;
        }
        Ie(u);
    }
    o($n, "drawEllipse");
    function Ie(e) {
        if (!e.pts) throw new O('drawPolygon() requires property "pts".');
        let n = e.pts.length;
        if (!(n < 3)) {
            if (
                (V(),
                l(e.pos),
                x(e.scale),
                T(e.angle),
                l(e.offset),
                e.fill !== !1)
            ) {
                let s = e.color ?? $.WHITE,
                    i = e.pts.map((u, f) => ({
                        pos: new y(u.x, u.y),
                        uv: new y(0, 0),
                        color: e.colors ? e.colors[f] ?? s : s,
                        opacity: e.opacity ?? 1,
                    })),
                    a = [...Array(n - 2).keys()]
                        .map((u) => [0, u + 1, u + 2])
                        .flat();
                ce(i, e.indices ?? a, e.fixed, v.defTex, e.shader, e.uniform);
            }
            e.outline &&
                Hn({
                    pts: [...e.pts, e.pts[0]],
                    radius: e.radius,
                    width: e.outline.width,
                    color: e.outline.color,
                    join: e.outline.join,
                    uniform: e.uniform,
                    fixed: e.fixed,
                    opacity: e.opacity,
                }),
                ee();
        }
    }
    o(Ie, "drawPolygon");
    function Kn(e, n, s) {
        me(),
            d.clear(d.STENCIL_BUFFER_BIT),
            d.enable(d.STENCIL_TEST),
            d.stencilFunc(d.NEVER, 1, 255),
            d.stencilOp(d.REPLACE, d.REPLACE, d.REPLACE),
            n(),
            me(),
            d.stencilFunc(s, 1, 255),
            d.stencilOp(d.KEEP, d.KEEP, d.KEEP),
            e(),
            me(),
            d.disable(d.STENCIL_TEST);
    }
    o(Kn, "drawStenciled");
    function zn(e, n) {
        Kn(e, n, d.EQUAL);
    }
    o(zn, "drawMasked");
    function Yn(e, n) {
        Kn(e, n, d.NOTEQUAL);
    }
    o(Yn, "drawSubtracted");
    function Xn() {
        return (v.viewport.width + v.viewport.height) / (v.width + v.height);
    }
    o(Xn, "getViewportScale");
    function Fe(e) {
        me();
        let n = v.width,
            s = v.height;
        (v.width = v.viewport.width),
            (v.height = v.viewport.height),
            e(),
            me(),
            (v.width = n),
            (v.height = s);
    }
    o(Fe, "drawUnscaled");
    function Wn(e, n) {
        n.pos && (e.pos = e.pos.add(n.pos)),
            n.scale && (e.scale = e.scale.scale(C(n.scale))),
            n.angle && (e.angle += n.angle),
            n.color && (e.color = e.color.mult(n.color)),
            n.opacity && (e.opacity *= n.opacity);
    }
    o(Wn, "applyCharTransform");
    let Jn = /\[(?<style>\w+)\](?<text>.*?)\[\/\k<style>\]/g;
    function Qs(e) {
        let n = {},
            s = e.replace(Jn, "$2"),
            i = 0;
        for (let a of e.matchAll(Jn)) {
            let u = a.index - i;
            for (let f = 0; f < a.groups.text.length; f++)
                n[f + u] = [a.groups.style];
            i += a[0].length - a.groups.text.length;
        }
        return { charStyleMap: n, text: s };
    }
    o(Qs, "compileStyledText");
    let fn = {};
    function Ve(e) {
        if (e.text === void 0)
            throw new O('formatText() requires property "text".');
        let n = rt(e.font);
        if (e.text === "" || n instanceof re || !n)
            return { width: 0, height: 0, chars: [], opt: e };
        let { charStyleMap: s, text: i } = Qs(e.text + ""),
            a = i.split("");
        if (n instanceof Ke || typeof n == "string") {
            let Y = n instanceof Ke ? n.fontface.family : n,
                N =
                    n instanceof Ke
                        ? { outline: n.outline, filter: n.filter }
                        : { outline: null, filter: jn },
                I = fn[Y] ?? {
                    font: {
                        tex: new Q(Hs, qs, { filter: N.filter }),
                        map: {},
                        size: Ns,
                    },
                    cursor: new y(0),
                    outline: N.outline,
                };
            fn[Y] || (fn[Y] = I), (n = I.font);
            for (let de of a)
                if (!I.font.map[de]) {
                    let b = ue;
                    b.clearRect(0, 0, Z.width, Z.height),
                        (b.font = `${n.size}px ${Y}`),
                        (b.textBaseline = "top"),
                        (b.textAlign = "left"),
                        (b.fillStyle = "#ffffff");
                    let R = b.measureText(de),
                        G = Math.ceil(R.width),
                        B = n.size;
                    I.outline &&
                        ((b.lineJoin = "round"),
                        (b.lineWidth = I.outline.width * 2),
                        (b.strokeStyle = I.outline.color.toHex()),
                        b.strokeText(de, I.outline.width, I.outline.width),
                        (G += I.outline.width * 2),
                        (B += I.outline.width * 3)),
                        b.fillText(
                            de,
                            I.outline?.width ?? 0,
                            I.outline?.width ?? 0
                        );
                    let H = b.getImageData(0, 0, G, B);
                    if (
                        I.cursor.x + G > Hs &&
                        ((I.cursor.x = 0), (I.cursor.y += B), I.cursor.y > qs)
                    )
                        throw new O("Font atlas exceeds character limit");
                    n.tex.update(H, I.cursor.x, I.cursor.y),
                        (n.map[de] = new oe(I.cursor.x, I.cursor.y, G, B)),
                        (I.cursor.x += G);
                }
        }
        let u = e.size || n.size,
            f = C(e.scale ?? 1).scale(u / n.size),
            p = e.lineSpacing ?? 0,
            m = e.letterSpacing ?? 0,
            h = 0,
            g = 0,
            E = 0,
            M = [],
            F = [],
            _ = 0,
            D = null,
            P = null;
        for (; _ < a.length; ) {
            let Y = a[_];
            if (
                Y ===
                `
`
            )
                (E += u + p),
                    M.push({ width: h - m, chars: F }),
                    (D = null),
                    (P = null),
                    (h = 0),
                    (F = []);
            else {
                let N = n.map[Y];
                if (N) {
                    let I = N.w * f.x;
                    e.width &&
                        h + I > e.width &&
                        ((E += u + p),
                        D != null &&
                            ((_ -= F.length - D),
                            (Y = a[_]),
                            (N = n.map[Y]),
                            (I = N.w * f.x),
                            (F = F.slice(0, D - 1)),
                            (h = P)),
                        (D = null),
                        (P = null),
                        M.push({ width: h - m, chars: F }),
                        (h = 0),
                        (F = [])),
                        F.push({
                            tex: n.tex,
                            width: N.w,
                            height: N.h,
                            quad: new oe(
                                N.x / n.tex.width,
                                N.y / n.tex.height,
                                N.w / n.tex.width,
                                N.h / n.tex.height
                            ),
                            ch: Y,
                            pos: new y(h, E),
                            opacity: e.opacity ?? 1,
                            color: e.color ?? $.WHITE,
                            scale: C(f),
                            angle: 0,
                        }),
                        Y === " " && ((D = F.length), (P = h)),
                        (h += I),
                        (g = Math.max(g, h)),
                        (h += m);
                }
            }
            _++;
        }
        M.push({ width: h - m, chars: F }), (E += u), e.width && (g = e.width);
        let se = [];
        for (let Y of M) {
            let N = (g - Y.width) * Fi(e.align ?? "left");
            for (let I of Y.chars) {
                let de = n.map[I.ch],
                    b = se.length;
                if (
                    ((I.pos = I.pos
                        .add(N, 0)
                        .add(de.w * f.x * 0.5, de.h * f.y * 0.5)),
                    e.transform)
                ) {
                    let R =
                        typeof e.transform == "function"
                            ? e.transform(b, I.ch)
                            : e.transform;
                    R && Wn(I, R);
                }
                if (s[b]) {
                    let R = s[b];
                    for (let G of R) {
                        let B = e.styles[G],
                            H = typeof B == "function" ? B(b, I.ch) : B;
                        H && Wn(I, H);
                    }
                }
                se.push(I);
            }
        }
        return { width: g, height: E, chars: se, opt: e };
    }
    o(Ve, "formatText");
    function Qn(e) {
        ke(Ve(e));
    }
    o(Qn, "drawText");
    function ke(e) {
        V(),
            l(e.opt.pos),
            T(e.opt.angle),
            l(
                et(e.opt.anchor ?? "topleft")
                    .add(1, 1)
                    .scale(e.width, e.height)
                    .scale(-0.5)
            ),
            e.chars.forEach((n) => {
                z({
                    tex: n.tex,
                    width: n.width,
                    height: n.height,
                    pos: n.pos,
                    scale: n.scale,
                    angle: n.angle,
                    color: n.color,
                    opacity: n.opacity,
                    quad: n.quad,
                    anchor: "center",
                    uniform: e.opt.uniform,
                    shader: e.opt.shader,
                    fixed: e.opt.fixed,
                });
            }),
            ee();
    }
    o(ke, "drawFormattedText");
    function ge() {
        return v.width;
    }
    o(ge, "width");
    function we() {
        return v.height;
    }
    o(we, "height");
    let Ye = {};
    function Zs(e) {
        return new y(
            ((e.x - v.viewport.x) * ge()) / v.viewport.width,
            ((e.y - v.viewport.y) * we()) / v.viewport.height
        );
    }
    o(Zs, "windowToContent");
    function er(e) {
        return new y(
            (e.x * v.viewport.width) / v.width,
            (e.y * v.viewport.height) / v.height
        );
    }
    o(er, "contentToView");
    function Gt() {
        return Zs(U.mousePos());
    }
    o(Gt, "mousePos"),
        (Ye.error = (e) => {
            e.error && e.error instanceof O
                ? Un(e.error)
                : e instanceof O && Un(e);
        }),
        (Ye.unhandledrejection = (e) => {
            e.reason instanceof O && Un(e.reason);
        });
    for (let e in Ye) window.addEventListener(e, Ye[e]);
    let Zn = !1,
        te = {
            inspect: !1,
            timeScale: 1,
            showLog: !0,
            fps: () => U.fps(),
            numFrames: () => U.numFrames(),
            stepFrame: hs,
            drawCalls: () => v.drawCalls,
            clearLog: () => (A.logs = []),
            log: (e) => {
                let n = r.logMax ?? Oi;
                A.logs.unshift({ msg: e, time: U.time() }),
                    A.logs.length > n && (A.logs = A.logs.slice(0, n));
            },
            error: (e) => te.log(new O(e.toString ? e.toString() : e)),
            curRecording: null,
            numObjects: () => yn("*", { recursive: !0 }).length,
            get paused() {
                return Zn;
            },
            set paused(e) {
                (Zn = e), e ? ne.ctx.suspend() : ne.ctx.resume();
            },
        };
    function Ue() {
        return U.dt() * te.timeScale;
    }
    o(Ue, "dt");
    function tr(...e) {
        return (
            e.length > 0 && (A.cam.pos = C(...e)),
            A.cam.pos ? A.cam.pos.clone() : kt()
        );
    }
    o(tr, "camPos");
    function nr(...e) {
        return e.length > 0 && (A.cam.scale = C(...e)), A.cam.scale.clone();
    }
    o(nr, "camScale");
    function sr(e) {
        return e !== void 0 && (A.cam.angle = e), A.cam.angle;
    }
    o(sr, "camRot");
    function rr(e = 12) {
        A.cam.shake += e;
    }
    o(rr, "shake");
    function es(e) {
        return A.cam.transform.multVec2(e);
    }
    o(es, "toScreen");
    function ts(e) {
        return A.cam.transform.invert().multVec2(e);
    }
    o(ts, "toWorld");
    function Ft(e) {
        let n = new be();
        return (
            e.pos && n.translate(e.pos),
            e.scale && n.scale(e.scale),
            e.angle && n.rotate(e.angle),
            e.parent ? n.mult(e.parent.transform) : n
        );
    }
    o(Ft, "calcTransform");
    function mn(e = []) {
        let n = new Map(),
            s = {},
            i = new De(),
            a = [],
            u = null,
            f = !1,
            p = {
                id: Ms(),
                hidden: !1,
                transform: new be(),
                children: [],
                parent: null,
                set paused(h) {
                    if (h !== f) {
                        f = h;
                        for (let g of a) g.paused = h;
                    }
                },
                get paused() {
                    return f;
                },
                add(h = []) {
                    let g = Array.isArray(h) ? mn(h) : h;
                    if (g.parent)
                        throw new O(
                            "Cannot add a game obj that already has a parent."
                        );
                    return (
                        (g.parent = this),
                        (g.transform = Ft(g)),
                        this.children.push(g),
                        g.trigger("add", g),
                        A.events.trigger("add", g),
                        g
                    );
                },
                readd(h) {
                    let g = this.children.indexOf(h);
                    return (
                        g !== -1 &&
                            (this.children.splice(g, 1), this.children.push(h)),
                        h
                    );
                },
                remove(h) {
                    let g = this.children.indexOf(h);
                    if (g !== -1) {
                        (h.parent = null), this.children.splice(g, 1);
                        let E = o((M) => {
                            M.trigger("destroy"),
                                A.events.trigger("destroy", M),
                                M.children.forEach((F) => E(F));
                        }, "trigger");
                        E(h);
                    }
                },
                removeAll(h) {
                    if (h) this.get(h).forEach((g) => this.remove(g));
                    else for (let g of [...this.children]) this.remove(g);
                },
                update() {
                    this.paused ||
                        (this.children
                            .sort((h, g) => (h.z ?? 0) - (g.z ?? 0))
                            .forEach((h) => h.update()),
                        this.trigger("update"));
                },
                draw() {
                    if (this.hidden) return;
                    let h = v.fixed;
                    this.fixed && (v.fixed = !0),
                        V(),
                        l(this.pos),
                        x(this.scale),
                        T(this.angle);
                    let g = this.children.sort(
                        (E, M) => (E.z ?? 0) - (M.z ?? 0)
                    );
                    if (this.mask) {
                        let E = { intersect: zn, subtract: Yn }[this.mask];
                        if (!E)
                            throw new O(`Invalid mask func: "${this.mask}"`);
                        E(
                            () => {
                                g.forEach((M) => M.draw());
                            },
                            () => {
                                this.trigger("draw");
                            }
                        );
                    } else this.trigger("draw"), g.forEach((E) => E.draw());
                    ee(), (v.fixed = h);
                },
                drawInspect() {
                    this.hidden ||
                        (V(),
                        l(this.pos),
                        x(this.scale),
                        T(this.angle),
                        this.children
                            .sort((h, g) => (h.z ?? 0) - (g.z ?? 0))
                            .forEach((h) => h.drawInspect()),
                        this.trigger("drawInspect"),
                        ee());
                },
                use(h) {
                    if (!h) return;
                    if (typeof h == "string") return this.use({ id: h });
                    let g = [];
                    h.id &&
                        (this.unuse(h.id),
                        (s[h.id] = []),
                        (g = s[h.id]),
                        n.set(h.id, h));
                    for (let M in h) {
                        if (Di.has(M)) continue;
                        let F = Object.getOwnPropertyDescriptor(h, M);
                        if (
                            (typeof F.value == "function" &&
                                (h[M] = h[M].bind(this)),
                            F.set &&
                                Object.defineProperty(h, M, {
                                    set: F.set.bind(this),
                                }),
                            F.get &&
                                Object.defineProperty(h, M, {
                                    get: F.get.bind(this),
                                }),
                            Gi.has(M))
                        ) {
                            let _ =
                                M === "add"
                                    ? () => {
                                          (u = o(
                                              (D) => g.push(D),
                                              "onCurCompCleanup"
                                          )),
                                              h[M](),
                                              (u = null);
                                      }
                                    : h[M];
                            g.push(this.on(M, _).cancel);
                        } else if (this[M] === void 0)
                            Object.defineProperty(this, M, {
                                get: () => h[M],
                                set: (_) => (h[M] = _),
                                configurable: !0,
                                enumerable: !0,
                            }),
                                g.push(() => delete this[M]);
                        else
                            throw new O(`Duplicate component property: "${M}"`);
                    }
                    let E = o(() => {
                        if (h.require) {
                            for (let M of h.require)
                                if (!this.c(M))
                                    throw new O(
                                        `Component "${h.id}" requires component "${M}"`
                                    );
                        }
                    }, "checkDeps");
                    h.destroy && g.push(h.destroy.bind(this)),
                        this.exists()
                            ? (E(),
                              h.add &&
                                  ((u = o(
                                      (M) => g.push(M),
                                      "onCurCompCleanup"
                                  )),
                                  h.add.call(this),
                                  (u = null)))
                            : h.require && g.push(this.on("add", E).cancel);
                },
                unuse(h) {
                    s[h] && (s[h].forEach((g) => g()), delete s[h]),
                        n.has(h) && n.delete(h);
                },
                c(h) {
                    return n.get(h);
                },
                get(h, g = {}) {
                    let E = g.recursive
                        ? this.children.flatMap(
                              o(function M(F) {
                                  return [F, ...F.children.flatMap(M)];
                              }, "recurse")
                          )
                        : this.children;
                    if (
                        ((E = E.filter((M) => (h ? M.is(h) : !0))),
                        g.liveUpdate)
                    ) {
                        let M = o(
                            (F) =>
                                g.recursive
                                    ? this.isAncestorOf(F)
                                    : F.parent === this,
                            "isChild"
                        );
                        gn((F) => {
                            M(F) && F.is(h) && E.push(F);
                        }),
                            ns((F) => {
                                if (M(F) && F.is(h)) {
                                    let _ = E.findIndex((D) => D.id === F.id);
                                    _ !== -1 && E.splice(_, 1);
                                }
                            });
                    }
                    return E;
                },
                isAncestorOf(h) {
                    return h.parent
                        ? h.parent === this || this.isAncestorOf(h.parent)
                        : !1;
                },
                exists() {
                    return A.root.isAncestorOf(this);
                },
                is(h) {
                    if (h === "*") return !0;
                    if (Array.isArray(h)) {
                        for (let g of h) if (!this.c(g)) return !1;
                        return !0;
                    } else return this.c(h) != null;
                },
                on(h, g) {
                    let E = i.on(h, g.bind(this));
                    return u && u(() => E.cancel()), E;
                },
                trigger(h, ...g) {
                    i.trigger(h, ...g), A.objEvents.trigger(h, this, ...g);
                },
                destroy() {
                    this.parent && this.parent.remove(this);
                },
                inspect() {
                    let h = {};
                    for (let [g, E] of n) h[g] = E.inspect ? E.inspect() : null;
                    return h;
                },
                onAdd(h) {
                    return this.on("add", h);
                },
                onUpdate(h) {
                    return this.on("update", h);
                },
                onDraw(h) {
                    return this.on("draw", h);
                },
                onDestroy(h) {
                    return this.on("destroy", h);
                },
                clearEvents() {
                    i.clear();
                },
            },
            m = [
                "onKeyPress",
                "onKeyPressRepeat",
                "onKeyDown",
                "onKeyRelease",
                "onMousePress",
                "onMouseDown",
                "onMouseRelease",
                "onMouseMove",
                "onCharInput",
                "onMouseMove",
                "onTouchStart",
                "onTouchMove",
                "onTouchEnd",
                "onScroll",
                "onGamepadButtonPress",
                "onGamepadButtonDown",
                "onGamepadButtonRelease",
                "onGamepadStick",
            ];
        for (let h of m)
            p[h] = (...g) => {
                let E = U[h](...g);
                return a.push(E), p.onDestroy(() => E.cancel()), E;
            };
        for (let h of e) p.use(h);
        return p;
    }
    o(mn, "make");
    function Be(e, n, s) {
        return (
            A.objEvents[e] || (A.objEvents[e] = new vt()),
            A.objEvents.on(e, (i, ...a) => {
                i.is(n) && s(i, ...a);
            })
        );
    }
    o(Be, "on");
    let pn = o((e, n) => {
            if (typeof e == "function" && n === void 0) {
                let s = dt([{ update: e }]);
                return {
                    get paused() {
                        return s.paused;
                    },
                    set paused(i) {
                        s.paused = i;
                    },
                    cancel: () => s.destroy(),
                };
            } else if (typeof e == "string") return Be("update", e, n);
        }, "onUpdate"),
        ir = o((e, n) => {
            if (typeof e == "function" && n === void 0) {
                let s = dt([{ draw: e }]);
                return {
                    get paused() {
                        return s.hidden;
                    },
                    set paused(i) {
                        s.hidden = i;
                    },
                    cancel: () => s.destroy(),
                };
            } else if (typeof e == "string") return Be("draw", e, n);
        }, "onDraw");
    function gn(e, n) {
        if (typeof e == "function" && n === void 0)
            return A.events.on("add", e);
        if (typeof e == "string") return Be("add", e, n);
    }
    o(gn, "onAdd");
    function ns(e, n) {
        if (typeof e == "function" && n === void 0)
            return A.events.on("destroy", e);
        if (typeof e == "string") return Be("destroy", e, n);
    }
    o(ns, "onDestroy");
    function or(e, n, s) {
        return Be("collide", e, (i, a, u) => a.is(n) && s(i, a, u));
    }
    o(or, "onCollide");
    function ar(e, n, s) {
        return Be("collideUpdate", e, (i, a, u) => a.is(n) && s(i, a, u));
    }
    o(ar, "onCollideUpdate");
    function ur(e, n, s) {
        return Be("collideEnd", e, (i, a, u) => a.is(n) && s(i, a, u));
    }
    o(ur, "onCollideEnd");
    function Bt(e, n) {
        yn(e, { recursive: !0 }).forEach(n), gn(e, n);
    }
    o(Bt, "forAllCurrentAndFuture");
    function cr(e, n) {
        if (typeof e == "function") return U.onMousePress(e);
        {
            let s = [];
            return (
                Bt(e, (i) => {
                    if (!i.area)
                        throw new O(
                            "onClick() requires the object to have area() component"
                        );
                    s.push(i.onClick(() => n(i)));
                }),
                Re.join(s)
            );
        }
    }
    o(cr, "onClick");
    function lr(e, n) {
        let s = [];
        return (
            Bt(e, (i) => {
                if (!i.area)
                    throw new O(
                        "onHover() requires the object to have area() component"
                    );
                s.push(i.onHover(() => n(i)));
            }),
            Re.join(s)
        );
    }
    o(lr, "onHover");
    function hr(e, n) {
        let s = [];
        return (
            Bt(e, (i) => {
                if (!i.area)
                    throw new O(
                        "onHoverUpdate() requires the object to have area() component"
                    );
                s.push(i.onHoverUpdate(() => n(i)));
            }),
            Re.join(s)
        );
    }
    o(hr, "onHoverUpdate");
    function dr(e, n) {
        let s = [];
        return (
            Bt(e, (i) => {
                if (!i.area)
                    throw new O(
                        "onHoverEnd() requires the object to have area() component"
                    );
                s.push(i.onHoverEnd(() => n(i)));
            }),
            Re.join(s)
        );
    }
    o(dr, "onHoverEnd");
    function Lt(e, n) {
        let s = 0,
            i = [];
        n && i.push(n);
        let a = pn(() => {
            (s += Ue()), s >= e && (a.cancel(), i.forEach((u) => u()));
        });
        return {
            paused: a.paused,
            cancel: a.cancel,
            onEnd(u) {
                i.push(u);
            },
            then(u) {
                return this.onEnd(u), this;
            },
        };
    }
    o(Lt, "wait");
    function fr(e, n) {
        let s = null,
            i = o(() => {
                (s = Lt(e, i)), n();
            }, "newAction");
        return (
            (s = Lt(0, i)),
            {
                get paused() {
                    return s.paused;
                },
                set paused(a) {
                    s.paused = a;
                },
                cancel: () => s.cancel(),
            }
        );
    }
    o(fr, "loop");
    function ss() {
        U.onKeyPress("f1", () => {
            te.inspect = !te.inspect;
        }),
            U.onKeyPress("f2", () => {
                te.clearLog();
            }),
            U.onKeyPress("f8", () => {
                te.paused = !te.paused;
            }),
            U.onKeyPress("f7", () => {
                te.timeScale = lt(Me(te.timeScale - 0.2, 0, 2), 1);
            }),
            U.onKeyPress("f9", () => {
                te.timeScale = lt(Me(te.timeScale + 0.2, 0, 2), 1);
            }),
            U.onKeyPress("f10", () => {
                te.stepFrame();
            });
    }
    o(ss, "enterDebugMode");
    function rs() {
        U.onKeyPress("b", () => it());
    }
    o(rs, "enterBurpMode");
    function mr(e) {
        A.gravity = e;
    }
    o(mr, "setGravity");
    function pr() {
        return A.gravity;
    }
    o(pr, "getGravity");
    function gr(...e) {
        e.length === 1 || e.length === 2
            ? ((v.bgColor = W(e[0])), e[1] && (v.bgAlpha = e[1]))
            : (e.length === 3 || e.length === 4) &&
              ((v.bgColor = W(e[0], e[1], e[2])), e[3] && (v.bgAlpha = e[3])),
            d.clearColor(
                v.bgColor.r / 255,
                v.bgColor.g / 255,
                v.bgColor.b / 255,
                v.bgAlpha
            );
    }
    o(gr, "setBackground");
    function wr() {
        return v.bgColor.clone();
    }
    o(wr, "getBackground");
    function It(...e) {
        return {
            id: "pos",
            pos: C(...e),
            moveBy(...n) {
                this.pos = this.pos.add(C(...n));
            },
            move(...n) {
                this.moveBy(C(...n).scale(Ue()));
            },
            moveTo(...n) {
                if (typeof n[0] == "number" && typeof n[1] == "number")
                    return this.moveTo(C(n[0], n[1]), n[2]);
                let s = n[0],
                    i = n[1];
                if (i === void 0) {
                    this.pos = C(s);
                    return;
                }
                let a = s.sub(this.pos);
                if (a.len() <= i * Ue()) {
                    this.pos = C(s);
                    return;
                }
                this.move(a.unit().scale(i));
            },
            worldPos() {
                return this.parent
                    ? this.parent.transform.multVec2(this.pos)
                    : this.pos;
            },
            screenPos() {
                let n = this.worldPos();
                return ht(this) ? n : es(n);
            },
            inspect() {
                return `(${Math.round(this.pos.x)}, ${Math.round(this.pos.y)})`;
            },
            drawInspect() {
                ze({ color: W(255, 0, 0), radius: 4 / Xn() });
            },
        };
    }
    o(It, "pos");
    function Vt(...e) {
        return e.length === 0
            ? Vt(1)
            : {
                  id: "scale",
                  scale: C(...e),
                  scaleTo(...n) {
                      this.scale = C(...n);
                  },
                  scaleBy(...n) {
                      this.scale.scale(C(...n));
                  },
                  inspect() {
                      return `(${lt(this.scale.x, 2)}, ${lt(this.scale.y, 2)})`;
                  },
              };
    }
    o(Vt, "scale");
    function vr(e) {
        return {
            id: "rotate",
            angle: e ?? 0,
            rotateBy(n) {
                this.angle += n;
            },
            rotateTo(n) {
                this.angle = n;
            },
            inspect() {
                return `${Math.round(this.angle)}`;
            },
        };
    }
    o(vr, "rotate");
    function br(...e) {
        return {
            id: "color",
            color: W(...e),
            inspect() {
                return this.color.toString();
            },
        };
    }
    o(br, "color");
    function lt(e, n) {
        return Number(e.toFixed(n));
    }
    o(lt, "toFixed");
    function yr(e) {
        return {
            id: "opacity",
            opacity: e ?? 1,
            inspect() {
                return `${lt(this.opacity, 1)}`;
            },
            fadeOut(n = 1, s = Ze.linear) {
                return En(this.opacity, 0, n, (i) => (this.opacity = i), s);
            },
        };
    }
    o(yr, "opacity");
    function wn(e) {
        if (!e) throw new O("Please define an anchor");
        return {
            id: "anchor",
            anchor: e,
            inspect() {
                return typeof this.anchor == "string"
                    ? this.anchor
                    : this.anchor.toString();
            },
        };
    }
    o(wn, "anchor");
    function xr(e) {
        return {
            id: "z",
            z: e,
            inspect() {
                return `${this.z}`;
            },
        };
    }
    o(xr, "z");
    function Ur(e, n) {
        return {
            id: "follow",
            require: ["pos"],
            follow: { obj: e, offset: n ?? C(0) },
            add() {
                e.exists() &&
                    (this.pos = this.follow.obj.pos.add(this.follow.offset));
            },
            update() {
                e.exists() &&
                    (this.pos = this.follow.obj.pos.add(this.follow.offset));
            },
        };
    }
    o(Ur, "follow");
    function Er(e, n) {
        let s = typeof e == "number" ? y.fromAngle(e) : e.unit();
        return {
            id: "move",
            require: ["pos"],
            update() {
                this.move(s.scale(n));
            },
        };
    }
    o(Er, "move");
    let Sr = 200;
    function Cr(e = {}) {
        let n = e.distance ?? Sr,
            s = !1;
        return {
            id: "offscreen",
            require: ["pos"],
            isOffScreen() {
                let i = this.screenPos(),
                    a = new he(C(0), ge(), we());
                return !pt(a, i) && a.sdistToPoint(i) > n * n;
            },
            onExitScreen(i) {
                return this.on("exitView", i);
            },
            onEnterScreen(i) {
                return this.on("enterView", i);
            },
            update() {
                this.isOffScreen()
                    ? (s || (this.trigger("exitView"), (s = !0)),
                      e.hide && (this.hidden = !0),
                      e.pause && (this.paused = !0),
                      e.destroy && this.destroy())
                    : (s && (this.trigger("enterView"), (s = !1)),
                      e.hide && (this.hidden = !1),
                      e.pause && (this.paused = !1));
            },
        };
    }
    o(Cr, "offscreen");
    function ht(e) {
        return e.fixed ? !0 : e.parent ? ht(e.parent) : !1;
    }
    o(ht, "isFixed");
    function Tr(e = {}) {
        let n = {},
            s = new Set();
        return {
            id: "area",
            collisionIgnore: e.collisionIgnore ?? [],
            add() {
                this.area.cursor &&
                    this.onHover(() => U.setCursor(this.area.cursor)),
                    this.onCollideUpdate((i, a) => {
                        n[i.id] || this.trigger("collide", i, a),
                            (n[i.id] = a),
                            s.add(i.id);
                    });
            },
            update() {
                for (let i in n)
                    s.has(Number(i)) ||
                        (this.trigger("collideEnd", n[i].target), delete n[i]);
                s.clear();
            },
            drawInspect() {
                let i = this.localArea();
                V(), x(this.area.scale), l(this.area.offset);
                let a = {
                    outline: { width: 4 / Xn(), color: W(0, 0, 255) },
                    anchor: this.anchor,
                    fill: !1,
                    fixed: ht(this),
                };
                i instanceof he
                    ? xe({ ...a, pos: i.pos, width: i.width, height: i.height })
                    : i instanceof _e
                    ? Ie({ ...a, pts: i.pts })
                    : i instanceof gt &&
                      ze({ ...a, pos: i.center, radius: i.radius }),
                    ee();
            },
            area: {
                shape: e.shape ?? null,
                scale: e.scale ? C(e.scale) : C(1),
                offset: e.offset ?? C(0),
                cursor: e.cursor ?? null,
            },
            isClicked() {
                return U.isMousePressed() && this.isHovering();
            },
            isHovering() {
                let i = ht(this) ? Gt() : ts(Gt());
                return this.hasPoint(i);
            },
            checkCollision(i) {
                return n[i.id] ?? null;
            },
            getCollisions() {
                return Object.values(n);
            },
            isColliding(i) {
                return !!n[i.id];
            },
            isOverlapping(i) {
                let a = n[i.id];
                return a && a.hasOverlap();
            },
            onClick(i) {
                let a = U.onMousePress("left", () => {
                    this.isHovering() && i();
                });
                return this.onDestroy(() => a.cancel()), a;
            },
            onHover(i) {
                let a = !1;
                return this.onUpdate(() => {
                    a
                        ? (a = this.isHovering())
                        : this.isHovering() && ((a = !0), i());
                });
            },
            onHoverUpdate(i) {
                return this.onUpdate(() => {
                    this.isHovering() && i();
                });
            },
            onHoverEnd(i) {
                let a = !1;
                return this.onUpdate(() => {
                    a
                        ? this.isHovering() || ((a = !1), i())
                        : (a = this.isHovering());
                });
            },
            onCollide(i, a) {
                if (typeof i == "function" && a === void 0)
                    return this.on("collide", i);
                if (typeof i == "string")
                    return this.onCollide((u, f) => {
                        u.is(i) && a(u, f);
                    });
            },
            onCollideUpdate(i, a) {
                if (typeof i == "function" && a === void 0)
                    return this.on("collideUpdate", i);
                if (typeof i == "string")
                    return this.on(
                        "collideUpdate",
                        (u, f) => u.is(i) && a(u, f)
                    );
            },
            onCollideEnd(i, a) {
                if (typeof i == "function" && a === void 0)
                    return this.on("collideEnd", i);
                if (typeof i == "string")
                    return this.on("collideEnd", (u) => u.is(i) && a(u));
            },
            hasPoint(i) {
                return Dn(this.worldArea(), i);
            },
            resolveCollision(i) {
                let a = this.checkCollision(i);
                a &&
                    !a.resolved &&
                    ((this.pos = this.pos.add(a.displacement)),
                    (a.resolved = !0));
            },
            localArea() {
                return this.area.shape ? this.area.shape : this.renderArea();
            },
            worldArea() {
                let i = this.localArea();
                if (!(i instanceof _e || i instanceof he))
                    throw new O("Only support polygon and rect shapes for now");
                let a = this.transform
                    .clone()
                    .scale(C(this.area.scale ?? 1))
                    .translate(this.area.offset);
                if (i instanceof he) {
                    let u = et(this.anchor || Kt)
                        .add(1, 1)
                        .scale(-0.5)
                        .scale(i.width, i.height);
                    a.translate(u);
                }
                return i.transform(a);
            },
            screenArea() {
                let i = this.worldArea();
                return ht(this) ? i : i.transform(A.cam.transform);
            },
        };
    }
    o(Tr, "area");
    function Xe(e) {
        return {
            color: e.color,
            opacity: e.opacity,
            anchor: e.anchor,
            outline: e.outline,
            shader: e.shader,
            uniform: e.uniform,
        };
    }
    o(Xe, "getRenderProps");
    function vn(e, n = {}) {
        let s = null,
            i = null,
            a = null,
            u = new ve();
        if (!e)
            throw new O("Please pass the resource name or data to sprite()");
        let f = o((p, m, h, g) => {
            let E = C(1, 1);
            return (
                h && g
                    ? ((E.x = h / (p.width * m.w)),
                      (E.y = g / (p.height * m.h)))
                    : h
                    ? ((E.x = h / (p.width * m.w)), (E.y = E.x))
                    : g && ((E.y = g / (p.height * m.h)), (E.x = E.y)),
                E
            );
        }, "calcTexScale");
        return {
            id: "sprite",
            width: 0,
            height: 0,
            frame: n.frame || 0,
            quad: n.quad || new oe(0, 0, 1, 1),
            animSpeed: n.animSpeed ?? 1,
            flipX: n.flipX ?? !1,
            flipY: n.flipY ?? !1,
            draw() {
                if (!s) return;
                let p = s.frames[this.frame ?? 0];
                if (!p) throw new O(`Frame not found: ${this.frame ?? 0}`);
                if (s.slice9) {
                    let { left: m, right: h, top: g, bottom: E } = s.slice9,
                        M = s.tex.width * p.w,
                        F = s.tex.height * p.h,
                        _ = this.width - m - h,
                        D = this.height - g - E,
                        P = m / M,
                        se = h / M,
                        Y = 1 - P - se,
                        N = g / F,
                        I = E / F,
                        de = 1 - N - I,
                        b = [
                            ae(0, 0, P, N),
                            ae(P, 0, Y, N),
                            ae(P + Y, 0, se, N),
                            ae(0, N, P, de),
                            ae(P, N, Y, de),
                            ae(P + Y, N, se, de),
                            ae(0, N + de, P, I),
                            ae(P, N + de, Y, I),
                            ae(P + Y, N + de, se, I),
                            ae(0, 0, m, g),
                            ae(m, 0, _, g),
                            ae(m + _, 0, h, g),
                            ae(0, g, m, D),
                            ae(m, g, _, D),
                            ae(m + _, g, h, D),
                            ae(0, g + D, m, E),
                            ae(m, g + D, _, E),
                            ae(m + _, g + D, h, E),
                        ];
                    for (let R = 0; R < 9; R++) {
                        let G = b[R],
                            B = b[R + 9];
                        Ae(
                            Object.assign(Xe(this), {
                                pos: B.pos(),
                                tex: s.tex,
                                quad: p.scale(G),
                                flipX: this.flipX,
                                flipY: this.flipY,
                                tiled: n.tiled,
                                width: B.w,
                                height: B.h,
                            })
                        );
                    }
                } else
                    Ae(
                        Object.assign(Xe(this), {
                            tex: s.tex,
                            quad: p.scale(this.quad ?? new oe(0, 0, 1, 1)),
                            flipX: this.flipX,
                            flipY: this.flipY,
                            tiled: n.tiled,
                            width: this.width,
                            height: this.height,
                        })
                    );
            },
            add() {
                let p = o((h) => {
                        let g = h.frames[0].clone();
                        n.quad && (g = g.scale(n.quad));
                        let E = f(h.tex, g, n.width, n.height);
                        (this.width = h.tex.width * g.w * E.x),
                            (this.height = h.tex.height * g.h * E.y),
                            n.anim && this.play(n.anim),
                            (s = h),
                            u.trigger(s);
                    }, "setSpriteData"),
                    m = st(e);
                m ? m.onLoad(p) : bn(() => p(st(e).data));
            },
            update() {
                if (!i) return;
                let p = s.anims[i.name];
                if (typeof p == "number") {
                    this.frame = p;
                    return;
                }
                if (p.speed === 0) throw new O("Sprite anim speed cannot be 0");
                (i.timer += Ue() * this.animSpeed),
                    i.timer >= 1 / i.speed &&
                        ((i.timer = 0),
                        (this.frame += a),
                        (this.frame < Math.min(p.from, p.to) ||
                            this.frame > Math.max(p.from, p.to)) &&
                            (i.loop
                                ? i.pingpong
                                    ? ((this.frame -= a),
                                      (a *= -1),
                                      (this.frame += a))
                                    : (this.frame = p.from)
                                : ((this.frame = p.to),
                                  i.onEnd(),
                                  this.stop())));
            },
            play(p, m = {}) {
                if (!s) {
                    u.add(() => this.play(p, m));
                    return;
                }
                let h = s.anims[p];
                if (h === void 0) throw new O(`Anim not found: ${p}`);
                i && this.stop(),
                    (i =
                        typeof h == "number"
                            ? {
                                  name: p,
                                  timer: 0,
                                  loop: !1,
                                  pingpong: !1,
                                  speed: 0,
                                  onEnd: () => {},
                              }
                            : {
                                  name: p,
                                  timer: 0,
                                  loop: m.loop ?? h.loop ?? !1,
                                  pingpong: m.pingpong ?? h.pingpong ?? !1,
                                  speed: m.speed ?? h.speed ?? 10,
                                  onEnd: m.onEnd ?? (() => {}),
                              }),
                    (a = typeof h == "number" ? null : h.from < h.to ? 1 : -1),
                    (this.frame = typeof h == "number" ? h : h.from),
                    this.trigger("animStart", p);
            },
            stop() {
                if (!i) return;
                let p = i.name;
                (i = null), this.trigger("animEnd", p);
            },
            numFrames() {
                return s?.frames.length ?? 0;
            },
            curAnim() {
                return i?.name;
            },
            onAnimEnd(p) {
                return this.on("animEnd", p);
            },
            onAnimStart(p) {
                return this.on("animStart", p);
            },
            renderArea() {
                return new he(C(0), this.width, this.height);
            },
            inspect() {
                if (typeof e == "string") return `"${e}"`;
            },
        };
    }
    o(vn, "sprite");
    function Ar(e, n = {}) {
        function s(a) {
            let u = Ve(
                Object.assign(Xe(a), {
                    text: a.text + "",
                    size: a.textSize,
                    font: a.font,
                    width: n.width && a.width,
                    align: a.align,
                    letterSpacing: a.letterSpacing,
                    lineSpacing: a.lineSpacing,
                    transform: a.textTransform,
                    styles: a.textStyles,
                })
            );
            return (
                n.width || (a.width = u.width / (a.scale?.x || 1)),
                (a.height = u.height / (a.scale?.y || 1)),
                u
            );
        }
        o(s, "update");
        let i = {
            id: "text",
            set text(a) {
                (e = a), s(this);
            },
            get text() {
                return e;
            },
            textSize: n.size ?? Ti,
            font: n.font,
            width: n.width ?? 0,
            height: 0,
            align: n.align,
            lineSpacing: n.lineSpacing,
            letterSpacing: n.letterSpacing,
            textTransform: n.transform,
            textStyles: n.styles,
            add() {
                bn(() => s(this));
            },
            draw() {
                ke(s(this));
            },
            renderArea() {
                return new he(C(0), this.width, this.height);
            },
        };
        return s(i), i;
    }
    o(Ar, "text");
    function Or(e, n, s = {}) {
        return {
            id: "rect",
            width: e,
            height: n,
            radius: s.radius || 0,
            draw() {
                xe(
                    Object.assign(Xe(this), {
                        width: this.width,
                        height: this.height,
                        radius: this.radius,
                    })
                );
            },
            renderArea() {
                return new he(C(0), this.width, this.height);
            },
            inspect() {
                return `${Math.ceil(this.width)}, ${Math.ceil(this.height)}`;
            },
        };
    }
    o(Or, "rect");
    function Pr(e, n) {
        return {
            id: "rect",
            width: e,
            height: n,
            draw() {
                z(
                    Object.assign(Xe(this), {
                        width: this.width,
                        height: this.height,
                    })
                );
            },
            renderArea() {
                return new he(C(0), this.width, this.height);
            },
            inspect() {
                return `${Math.ceil(this.width)}, ${Math.ceil(this.height)}`;
            },
        };
    }
    o(Pr, "uvquad");
    function Mr(e) {
        return {
            id: "circle",
            radius: e,
            draw() {
                ze(Object.assign(Xe(this), { radius: this.radius }));
            },
            renderArea() {
                return new he(
                    new y(this.anchor ? 0 : -this.radius),
                    this.radius * 2,
                    this.radius * 2
                );
            },
            inspect() {
                return `${Math.ceil(this.radius)}`;
            },
        };
    }
    o(Mr, "circle");
    function Rr(e = 1, n = W(0, 0, 0)) {
        return { id: "outline", outline: { width: e, color: n } };
    }
    o(Rr, "outline");
    function is() {
        return {
            id: "timer",
            wait(e, n) {
                let s = [];
                n && s.push(n);
                let i = 0,
                    a = this.onUpdate(() => {
                        (i += Ue()),
                            i >= e && (s.forEach((u) => u()), a.cancel());
                    });
                return {
                    get paused() {
                        return a.paused;
                    },
                    set paused(u) {
                        a.paused = u;
                    },
                    cancel: a.cancel,
                    onEnd(u) {
                        s.push(u);
                    },
                    then(u) {
                        return this.onEnd(u), this;
                    },
                };
            },
            loop(e, n) {
                let s = null,
                    i = o(() => {
                        (s = this.wait(e, i)), n();
                    }, "newAction");
                return (
                    (s = this.wait(0, i)),
                    {
                        get paused() {
                            return s.paused;
                        },
                        set paused(a) {
                            s.paused = a;
                        },
                        cancel: () => s.cancel(),
                    }
                );
            },
            tween(e, n, s, i, a = Ze.linear) {
                let u = 0,
                    f = [],
                    p = this.onUpdate(() => {
                        u += Ue();
                        let m = Math.min(u / s, 1);
                        i(Se(e, n, a(m))),
                            m === 1 &&
                                (p.cancel(), i(n), f.forEach((h) => h()));
                    });
                return {
                    get paused() {
                        return p.paused;
                    },
                    set paused(m) {
                        p.paused = m;
                    },
                    onEnd(m) {
                        f.push(m);
                    },
                    then(m) {
                        return this.onEnd(m), this;
                    },
                    cancel() {
                        p.cancel();
                    },
                    finish() {
                        p.cancel(), i(n), f.forEach((m) => m());
                    },
                };
            },
        };
    }
    o(is, "timer");
    let Dr = 640,
        Gr = 65536;
    function Fr(e = {}) {
        let n = C(0),
            s = null,
            i = null,
            a = !1;
        return {
            id: "body",
            require: ["pos", "area"],
            jumpForce: e.jumpForce ?? Dr,
            gravityScale: e.gravityScale ?? 1,
            isStatic: e.isStatic ?? !1,
            mass: e.mass ?? 1,
            add() {
                if (this.mass === 0) throw new O("Can't set body mass to 0");
                this.onCollideUpdate((u, f) => {
                    if (
                        u.is("body") &&
                        !f.resolved &&
                        (this.trigger("beforePhysicsResolve", f),
                        u.trigger("beforePhysicsResolve", f.reverse()),
                        !f.resolved && !(this.isStatic && u.isStatic))
                    ) {
                        if (!this.isStatic && !u.isStatic) {
                            let p = this.mass + u.mass;
                            (this.pos = this.pos.add(
                                f.displacement.scale(u.mass / p)
                            )),
                                (u.pos = u.pos.add(
                                    f.displacement.scale(-this.mass / p)
                                )),
                                (this.transform = Ft(this)),
                                (u.transform = Ft(u));
                        } else {
                            let p =
                                !this.isStatic && u.isStatic ? f : f.reverse();
                            (p.source.pos = p.source.pos.add(p.displacement)),
                                (p.source.transform = Ft(p.source));
                        }
                        (f.resolved = !0),
                            this.trigger("physicsResolve", f),
                            u.trigger("physicsResolve", f.reverse());
                    }
                }),
                    this.onPhysicsResolve((u) => {
                        A.gravity &&
                            (u.isBottom() && this.isFalling()
                                ? ((n.y = 0),
                                  (s = u.target),
                                  (i = u.target.pos),
                                  a ? (a = !1) : this.trigger("ground", s))
                                : u.isTop() &&
                                  this.isJumping() &&
                                  ((n.y = 0),
                                  this.trigger("headbutt", u.target)));
                    });
            },
            update() {
                if (!A.gravity || this.isStatic) return;
                if (
                    (a &&
                        ((s = null),
                        (i = null),
                        this.trigger("fallOff"),
                        (a = !1)),
                    s)
                )
                    if (!this.isOverlapping(s) || !s.exists() || !s.is("body"))
                        a = !0;
                    else {
                        !s.pos.eq(i) &&
                            e.stickToPlatform !== !1 &&
                            this.moveBy(s.pos.sub(i)),
                            (i = s.pos);
                        return;
                    }
                let u = n.y;
                (n.y += A.gravity * this.gravityScale * Ue()),
                    (n.y = Math.min(n.y, e.maxVelocity ?? Gr)),
                    u < 0 && n.y >= 0 && this.trigger("fall"),
                    this.move(n);
            },
            onPhysicsResolve(u) {
                return this.on("physicsResolve", u);
            },
            onBeforePhysicsResolve(u) {
                return this.on("beforePhysicsResolve", u);
            },
            curPlatform() {
                return s;
            },
            isGrounded() {
                return s !== null;
            },
            isFalling() {
                return n.y > 0;
            },
            isJumping() {
                return n.y < 0;
            },
            jump(u) {
                (s = null), (i = null), (n.y = -u || -this.jumpForce);
            },
            onGround(u) {
                return this.on("ground", u);
            },
            onFall(u) {
                return this.on("fall", u);
            },
            onFallOff(u) {
                return this.on("fallOff", u);
            },
            onHeadbutt(u) {
                return this.on("headbutt", u);
            },
        };
    }
    o(Fr, "body");
    function Br(e = 2) {
        let n = e;
        return {
            id: "doubleJump",
            require: ["body"],
            numJumps: e,
            add() {
                this.onGround(() => {
                    n = this.numJumps;
                });
            },
            doubleJump(s) {
                n <= 0 ||
                    (n < this.numJumps && this.trigger("doubleJump"),
                    n--,
                    this.jump(s));
            },
            onDoubleJump(s) {
                return this.on("doubleJump", s);
            },
            inspect() {
                return `${n}`;
            },
        };
    }
    o(Br, "doubleJump");
    function Lr(e, n) {
        return {
            id: "shader",
            shader: e,
            ...(typeof n == "function"
                ? {
                      uniform: n(),
                      update() {
                          this.uniform = n();
                      },
                  }
                : { uniform: n }),
        };
    }
    o(Lr, "shader");
    function Ir() {
        return { id: "fixed", fixed: !0 };
    }
    o(Ir, "fixed");
    function os(e) {
        return { id: "stay", stay: !0, scenesToStay: e };
    }
    o(os, "stay");
    function Vr(e) {
        if (e == null)
            throw new O("health() requires the initial amount of hp");
        let n = e;
        return {
            id: "health",
            hurt(s = 1) {
                this.setHP(e - s), this.trigger("hurt", s);
            },
            heal(s = 1) {
                this.setHP(e + s), this.trigger("heal", s);
            },
            hp() {
                return e;
            },
            maxHP() {
                return n;
            },
            setHP(s) {
                (e = s), e <= 0 && this.trigger("death");
            },
            onHurt(s) {
                return this.on("hurt", s);
            },
            onHeal(s) {
                return this.on("heal", s);
            },
            onDeath(s) {
                return this.on("death", s);
            },
            inspect() {
                return `${e}`;
            },
        };
    }
    o(Vr, "health");
    function kr(e, n = {}) {
        if (e == null) throw new O("lifespan() requires time");
        let s = n.fade ?? 0;
        return {
            id: "lifespan",
            async add() {
                await Lt(e),
                    s > 0 &&
                        this.opacity &&
                        (await En(
                            this.opacity,
                            0,
                            s,
                            (i) => (this.opacity = i),
                            Ze.linear
                        )),
                    this.destroy();
            },
        };
    }
    o(kr, "lifespan");
    function jr(e, n, s) {
        if (!e) throw new O("state() requires an initial state");
        let i = {};
        function a(m) {
            i[m] ||
                (i[m] = {
                    enter: new ve(),
                    end: new ve(),
                    update: new ve(),
                    draw: new ve(),
                });
        }
        o(a, "initStateEvents");
        function u(m, h, g) {
            return a(h), i[h][m].add(g);
        }
        o(u, "on");
        function f(m, h, ...g) {
            a(h), i[h][m].trigger(...g);
        }
        o(f, "trigger");
        let p = !1;
        return {
            id: "state",
            state: e,
            enterState(m, ...h) {
                if (((p = !0), n && !n.includes(m)))
                    throw new O(`State not found: ${m}`);
                let g = this.state;
                if (s) {
                    if (!s?.[g]) return;
                    let E = typeof s[g] == "string" ? [s[g]] : s[g];
                    if (!E.includes(m))
                        throw new O(
                            `Cannot transition state from "${g}" to "${m}". Available transitions: ${E.map(
                                (M) => `"${M}"`
                            ).join(", ")}`
                        );
                }
                f("end", g, ...h),
                    (this.state = m),
                    f("enter", m, ...h),
                    f("enter", `${g} -> ${m}`, ...h);
            },
            onStateTransition(m, h, g) {
                return u("enter", `${m} -> ${h}`, g);
            },
            onStateEnter(m, h) {
                return u("enter", m, h);
            },
            onStateUpdate(m, h) {
                return u("update", m, h);
            },
            onStateDraw(m, h) {
                return u("draw", m, h);
            },
            onStateEnd(m, h) {
                return u("end", m, h);
            },
            update() {
                p || (f("enter", e), (p = !0)), f("update", this.state);
            },
            draw() {
                f("draw", this.state);
            },
            inspect() {
                return this.state;
            },
        };
    }
    o(jr, "state");
    function Nr(e = 1) {
        let n = 0,
            s = !1;
        return {
            require: ["opacity"],
            add() {
                this.opacity = 0;
            },
            update() {
                s ||
                    ((n += Ue()),
                    (this.opacity = Nt(n, 0, e, 0, 1)),
                    n >= e && ((this.opacity = 1), (s = !0)));
            },
        };
    }
    o(Nr, "fadeIn");
    function _r(e = "intersect") {
        return { id: "mask", mask: e };
    }
    o(_r, "mask");
    function bn(e) {
        k.loaded ? e() : A.events.on("load", e);
    }
    o(bn, "onLoad");
    function Hr(e, n) {
        A.scenes[e] = n;
    }
    o(Hr, "scene");
    function qr(e, ...n) {
        if (!A.scenes[e]) throw new O(`Scene not found: ${e}`);
        A.events.onOnce("frameEnd", () => {
            A.events.trigger("sceneLeave", e),
                U.events.clear(),
                A.events.clear(),
                A.objEvents.clear(),
                [...A.root.children].forEach((s) => {
                    (!s.stay ||
                        (s.scenesToStay && !s.scenesToStay.includes(e))) &&
                        A.root.remove(s);
                }),
                A.root.clearEvents(),
                (A.cam = {
                    pos: null,
                    scale: C(1),
                    angle: 0,
                    shake: 0,
                    transform: new be(),
                }),
                A.scenes[e](...n),
                r.debug !== !1 && ss(),
                r.burp && rs();
        });
    }
    o(qr, "go");
    function $r(e) {
        return A.events.on("sceneLeave", e);
    }
    o($r, "onSceneLeave");
    function Kr(e, n) {
        try {
            return JSON.parse(window.localStorage[e]);
        } catch {
            return n ? (as(e, n), n) : null;
        }
    }
    o(Kr, "getData");
    function as(e, n) {
        window.localStorage[e] = JSON.stringify(n);
    }
    o(as, "setData");
    function us(e, ...n) {
        let s = e(je),
            i;
        typeof s == "function" ? (i = s(...n)(je)) : (i = s);
        for (let a in i) (je[a] = i[a]), r.global !== !1 && (window[a] = i[a]);
        return je;
    }
    o(us, "plug");
    function kt() {
        return C(ge() / 2, we() / 2);
    }
    o(kt, "center");
    let zr;
    ((P) => (
        (P[(P.None = 0)] = "None"),
        (P[(P.Left = 1)] = "Left"),
        (P[(P.Top = 2)] = "Top"),
        (P[(P.LeftTop = 3)] = "LeftTop"),
        (P[(P.Right = 4)] = "Right"),
        (P[(P.Horizontal = 5)] = "Horizontal"),
        (P[(P.RightTop = 6)] = "RightTop"),
        (P[(P.HorizontalTop = 7)] = "HorizontalTop"),
        (P[(P.Bottom = 8)] = "Bottom"),
        (P[(P.LeftBottom = 9)] = "LeftBottom"),
        (P[(P.Vertical = 10)] = "Vertical"),
        (P[(P.LeftVertical = 11)] = "LeftVertical"),
        (P[(P.RightBottom = 12)] = "RightBottom"),
        (P[(P.HorizontalBottom = 13)] = "HorizontalBottom"),
        (P[(P.RightVertical = 14)] = "RightVertical"),
        (P[(P.All = 15)] = "All")
    ))((zr ||= {}));
    function cs(e = {}) {
        let n = C(0),
            s = e.isObstacle ?? !1,
            i = e.cost ?? 0,
            a = e.edges ?? [],
            u = o(() => {
                let p = { left: 1, top: 2, right: 4, bottom: 8 };
                return a.map((m) => p[m] || 0).reduce((m, h) => m | h, 0);
            }, "getEdgeMask"),
            f = u();
        return {
            id: "tile",
            tilePosOffset: e.offset ?? C(0),
            set tilePos(p) {
                let m = this.getLevel();
                (n = p.clone()),
                    (this.pos = C(
                        this.tilePos.x * m.tileWidth(),
                        this.tilePos.y * m.tileHeight()
                    ).add(this.tilePosOffset));
            },
            get tilePos() {
                return n;
            },
            set isObstacle(p) {
                s !== p && ((s = p), this.getLevel().invalidateNavigationMap());
            },
            get isObstacle() {
                return s;
            },
            set cost(p) {
                i !== p && ((i = p), this.getLevel().invalidateNavigationMap());
            },
            get cost() {
                return i;
            },
            set edges(p) {
                (a = p), (f = u()), this.getLevel().invalidateNavigationMap();
            },
            get edges() {
                return a;
            },
            get edgeMask() {
                return f;
            },
            getLevel() {
                return this.parent;
            },
            moveLeft() {
                this.tilePos = this.tilePos.add(C(-1, 0));
            },
            moveRight() {
                this.tilePos = this.tilePos.add(C(1, 0));
            },
            moveUp() {
                this.tilePos = this.tilePos.add(C(0, -1));
            },
            moveDown() {
                this.tilePos = this.tilePos.add(C(0, 1));
            },
        };
    }
    o(cs, "tile");
    function Yr(e, n) {
        if (!n.tileWidth || !n.tileHeight)
            throw new O("Must provide tileWidth and tileHeight.");
        let s = dt([It(n.pos ?? C(0))]),
            i = e.length,
            a = 0,
            u = null,
            f = null,
            p = null,
            m = null,
            h = o((b) => b.x + b.y * a, "tile2Hash"),
            g = o((b) => C(Math.floor(b % a), Math.floor(b / a)), "hash2Tile"),
            E = o(() => {
                u = [];
                for (let b of s.children) M(b);
            }, "createSpatialMap"),
            M = o((b) => {
                let R = h(b.tilePos);
                u[R] ? u[R].push(b) : (u[R] = [b]);
            }, "insertIntoSpatialMap"),
            F = o((b) => {
                let R = h(b.tilePos);
                if (u[R]) {
                    let G = u[R].indexOf(b);
                    G >= 0 && u[R].splice(G, 1);
                }
            }, "removeFromSpatialMap"),
            _ = o(() => {
                let b = !1;
                for (let R of s.children) {
                    let G = s.pos2Tile(R.pos);
                    (R.tilePos.x != G.x || R.tilePos.y != G.y) &&
                        ((b = !0),
                        F(R),
                        (R.tilePos.x = G.x),
                        (R.tilePos.y = G.y),
                        M(R));
                }
                b && s.trigger("spatial_map_changed");
            }, "updateSpatialMap"),
            D = o(() => {
                let b = s.getSpatialMap(),
                    R = s.numRows() * s.numColumns();
                f ? (f.length = R) : (f = new Array(R)), f.fill(1, 0, R);
                for (let G = 0; G < b.length; G++) {
                    let B = b[G];
                    if (B) {
                        let H = 0;
                        for (let X of B)
                            if (X.isObstacle) {
                                H = 1 / 0;
                                break;
                            } else H += X.cost;
                        f[G] = H || 1;
                    }
                }
            }, "createCostMap"),
            P = o(() => {
                let b = s.getSpatialMap(),
                    R = s.numRows() * s.numColumns();
                p ? (p.length = R) : (p = new Array(R)), p.fill(15, 0, R);
                for (let G = 0; G < b.length; G++) {
                    let B = b[G];
                    if (B) {
                        let H = B.length,
                            X = 15;
                        for (let ie = 0; ie < H; ie++) X |= B[ie].edgeMask;
                        p[G] = X;
                    }
                }
            }, "createEdgeMap"),
            se = o(() => {
                let b = s.numRows() * s.numColumns(),
                    R = o((B, H) => {
                        let X = [];
                        for (X.push(B); X.length > 0; ) {
                            let ie = X.pop();
                            I(ie).forEach((fe) => {
                                m[fe] < 0 && ((m[fe] = H), X.push(fe));
                            });
                        }
                    }, "traverse");
                m ? (m.length = b) : (m = new Array(b)), m.fill(-1, 0, b);
                let G = 0;
                for (let B = 0; B < f.length; B++) {
                    if (m[B] >= 0) {
                        G++;
                        continue;
                    }
                    R(B, G), G++;
                }
            }, "createConnectivityMap"),
            Y = o((b, R) => f[R], "getCost"),
            N = o((b, R) => {
                let G = g(b),
                    B = g(R);
                return G.dist(B);
            }, "getHeuristic"),
            I = o((b, R) => {
                let G = [],
                    B = Math.floor(b % a),
                    H = B > 0 && p[b] & 1 && f[b - 1] !== 1 / 0,
                    X = b >= a && p[b] & 2 && f[b - a] !== 1 / 0,
                    ie = B < a - 1 && p[b] & 4 && f[b + 1] !== 1 / 0,
                    fe = b < a * i - a - 1 && p[b] & 8 && f[b + a] !== 1 / 0;
                return (
                    R
                        ? (H &&
                              (X && G.push(b - a - 1),
                              G.push(b - 1),
                              fe && G.push(b + a - 1)),
                          X && G.push(b - a),
                          ie &&
                              (X && G.push(b - a + 1),
                              G.push(b + 1),
                              fe && G.push(b + a + 1)),
                          fe && G.push(b + a))
                        : (H && G.push(b - 1),
                          X && G.push(b - a),
                          ie && G.push(b + 1),
                          fe && G.push(b + a)),
                    G
                );
            }, "getNeighbours"),
            de = {
                id: "level",
                tileWidth() {
                    return n.tileWidth;
                },
                tileHeight() {
                    return n.tileHeight;
                },
                spawn(b, ...R) {
                    let G = C(...R),
                        B = (() => {
                            if (typeof b == "string") {
                                if (n.tiles[b]) {
                                    if (typeof n.tiles[b] != "function")
                                        throw new O(
                                            "Level symbol def must be a function returning a component list"
                                        );
                                    return n.tiles[b](G);
                                } else if (n.wildcardTile)
                                    return n.wildcardTile(b, G);
                            } else {
                                if (Array.isArray(b)) return b;
                                throw new O(
                                    "Expected a symbol or a component list"
                                );
                            }
                        })();
                    if (!B) return null;
                    let H = !1,
                        X = !1;
                    for (let fe of B)
                        fe.id === "tile" && (X = !0),
                            fe.id === "pos" && (H = !0);
                    H || B.push(It()), X || B.push(cs());
                    let ie = s.add(B);
                    return (
                        H && (ie.tilePosOffset = ie.pos.clone()),
                        (ie.tilePos = G),
                        u &&
                            (M(ie),
                            this.trigger("spatial_map_changed"),
                            this.trigger("navigation_map_invalid")),
                        ie
                    );
                },
                numColumns() {
                    return a;
                },
                numRows() {
                    return i;
                },
                levelWidth() {
                    return a * this.tileWidth();
                },
                levelHeight() {
                    return i * this.tileHeight();
                },
                tile2Pos(...b) {
                    return C(...b).scale(this.tileWidth(), this.tileHeight());
                },
                pos2Tile(...b) {
                    let R = C(...b);
                    return C(
                        Math.floor(R.x / this.tileWidth()),
                        Math.floor(R.y / this.tileHeight())
                    );
                },
                getSpatialMap() {
                    return u || E(), u;
                },
                onSpatialMapChanged(b) {
                    return this.on("spatial_map_changed", b);
                },
                onNavigationMapInvalid(b) {
                    return this.on("navigation_map_invalid", b);
                },
                getAt(b) {
                    u || E();
                    let R = h(b);
                    return u[R] || [];
                },
                update() {
                    u && _();
                },
                invalidateNavigationMap() {
                    (f = null), (p = null), (m = null);
                },
                onNavigationMapChanged(b) {
                    return this.on("navigation_map_changed", b);
                },
                getTilePath(b, R, G = {}) {
                    if (
                        (f || D(),
                        p || P(),
                        m || se(),
                        b.x < 0 ||
                            b.x >= a ||
                            b.y < 0 ||
                            b.y >= i ||
                            R.x < 0 ||
                            R.x >= a ||
                            R.y < 0 ||
                            R.y >= i)
                    )
                        return null;
                    let B = h(b),
                        H = h(R);
                    if (f[H] === 1 / 0) return null;
                    if (B === H) return [];
                    if (m[B] != -1 && m[B] !== m[H]) return null;
                    let X = new _t((Oe, Cn) => Oe.cost < Cn.cost);
                    X.insert({ cost: 0, node: B });
                    let ie = new Map();
                    ie.set(B, B);
                    let fe = new Map();
                    for (fe.set(B, 0); X.length !== 0; ) {
                        let Oe = X.remove()?.node;
                        if (Oe === H) break;
                        let Cn = I(Oe, G.allowDiagonals);
                        for (let Ne of Cn) {
                            let Tn = (fe.get(Oe) || 0) + Y(Oe, Ne) + N(Ne, H);
                            (!fe.has(Ne) || Tn < fe.get(Ne)) &&
                                (fe.set(Ne, Tn),
                                X.insert({ cost: Tn, node: Ne }),
                                ie.set(Ne, Oe));
                        }
                    }
                    let Sn = [],
                        ft = H,
                        fi = g(ft);
                    for (Sn.push(fi); ft !== B; ) {
                        ft = ie.get(ft);
                        let Oe = g(ft);
                        Sn.push(Oe);
                    }
                    return Sn.reverse();
                },
                getPath(b, R, G = {}) {
                    let B = this.tileWidth(),
                        H = this.tileHeight(),
                        X = this.getTilePath(
                            this.pos2Tile(b),
                            this.pos2Tile(R),
                            G
                        );
                    return X
                        ? [
                              b,
                              ...X.slice(1, -1).map((ie) =>
                                  ie.scale(B, H).add(B / 2, H / 2)
                              ),
                              R,
                          ]
                        : null;
                },
            };
        return (
            s.use(de),
            s.onNavigationMapInvalid(() => {
                s.invalidateNavigationMap(),
                    s.trigger("navigation_map_changed");
            }),
            e.forEach((b, R) => {
                let G = b.split("");
                (a = Math.max(G.length, a)),
                    G.forEach((B, H) => {
                        s.spawn(B, C(H, R));
                    });
            }),
            s
        );
    }
    o(Yr, "addLevel");
    function Xr(e = {}) {
        let n = null,
            s = null,
            i = null,
            a = null;
        return {
            id: "agent",
            require: ["pos", "tile"],
            agentSpeed: e.speed ?? 100,
            allowDiagonals: e.allowDiagonals ?? !0,
            getDistanceToTarget() {
                return n ? this.pos.dist(n) : 0;
            },
            getNextLocation() {
                return s && i ? s[i] : null;
            },
            getPath() {
                return s ? s.slice() : null;
            },
            getTarget() {
                return n;
            },
            isNavigationFinished() {
                return s ? i === null : !0;
            },
            isTargetReachable() {
                return s !== null;
            },
            isTargetReached() {
                return n ? this.pos.eq(n) : !0;
            },
            setTarget(u) {
                (n = u),
                    (s = this.getLevel().getPath(this.pos, n, {
                        allowDiagonals: this.allowDiagonals,
                    })),
                    (i = s ? 0 : null),
                    s
                        ? (a ||
                              ((a = this.getLevel().onNavigationMapChanged(
                                  () => {
                                      s &&
                                          i !== null &&
                                          ((s = this.getLevel().getPath(
                                              this.pos,
                                              n,
                                              {
                                                  allowDiagonals:
                                                      this.allowDiagonals,
                                              }
                                          )),
                                          (i = s ? 0 : null),
                                          s
                                              ? this.trigger(
                                                    "navigation-next",
                                                    this,
                                                    s[i]
                                                )
                                              : this.trigger(
                                                    "navigation-ended",
                                                    this
                                                ));
                                  }
                              )),
                              this.onDestroy(() => a.cancel())),
                          this.trigger("navigation-started", this),
                          this.trigger("navigation-next", this, s[i]))
                        : this.trigger("navigation-ended", this);
            },
            update() {
                if (s && i !== null) {
                    if (this.pos.sdist(s[i]) < 2)
                        if (i === s.length - 1) {
                            (this.pos = n.clone()),
                                (i = null),
                                this.trigger("navigation-ended", this),
                                this.trigger("target-reached", this);
                            return;
                        } else i++, this.trigger("navigation-next", this, s[i]);
                    this.moveTo(s[i], this.agentSpeed);
                }
            },
            onNavigationStarted(u) {
                return this.on("navigation-started", u);
            },
            onNavigationNext(u) {
                return this.on("navigation-next", u);
            },
            onNavigationEnded(u) {
                return this.on("navigation-ended", u);
            },
            onTargetReached(u) {
                return this.on("target-reached", u);
            },
            inspect() {
                return JSON.stringify({
                    target: JSON.stringify(n),
                    path: JSON.stringify(s),
                });
            },
        };
    }
    o(Xr, "agent");
    function Wr(e) {
        let n = U.canvas().captureStream(e),
            s = ne.ctx.createMediaStreamDestination();
        ne.masterNode.connect(s);
        let i = new MediaRecorder(n),
            a = [];
        return (
            (i.ondataavailable = (u) => {
                u.data.size > 0 && a.push(u.data);
            }),
            (i.onerror = () => {
                ne.masterNode.disconnect(s),
                    n.getTracks().forEach((u) => u.stop());
            }),
            i.start(),
            {
                resume() {
                    i.resume();
                },
                pause() {
                    i.pause();
                },
                stop() {
                    return (
                        i.stop(),
                        ne.masterNode.disconnect(s),
                        n.getTracks().forEach((u) => u.stop()),
                        new Promise((u) => {
                            i.onstop = () => {
                                u(new Blob(a, { type: "video/mp4" }));
                            };
                        })
                    );
                },
                download(u = "kaboom.mp4") {
                    this.stop().then((f) => Bn(u, f));
                },
            }
        );
    }
    o(Wr, "record");
    function Jr() {
        return document.activeElement === U.canvas();
    }
    o(Jr, "isFocused");
    function Qr(e) {
        e.destroy();
    }
    o(Qr, "destroy");
    let dt = A.root.add.bind(A.root),
        Zr = A.root.readd.bind(A.root),
        ei = A.root.removeAll.bind(A.root),
        yn = A.root.get.bind(A.root);
    function ls(e = 2, n = 1) {
        let s = 0;
        return {
            id: "boom",
            require: ["scale"],
            update() {
                let i = Math.sin(s * e) * n;
                i < 0 && this.destroy(), (this.scale = C(i)), (s += Ue());
            },
        };
    }
    o(ls, "boom");
    let ti = Le(null, Is),
        ni = Le(null, Vs);
    function si(e, n = {}) {
        let s = dt([It(e), os()]),
            i = (n.speed || 1) * 5,
            a = n.scale || 1;
        s.add([vn(ni), Vt(0), wn("center"), ls(i, a), ...(n.comps ?? [])]);
        let u = s.add([vn(ti), Vt(0), wn("center"), is(), ...(n.comps ?? [])]);
        return (
            u.wait(0.4 / i, () => u.use(ls(i, a))),
            u.onDestroy(() => s.destroy()),
            s
        );
    }
    o(si, "addKaboom");
    function hs() {
        A.root.update();
    }
    o(hs, "updateFrame");
    class xn {
        static {
            o(this, "Collision");
        }
        source;
        target;
        displacement;
        resolved = !1;
        constructor(n, s, i, a = !1) {
            (this.source = n),
                (this.target = s),
                (this.displacement = i),
                (this.resolved = a);
        }
        reverse() {
            return new xn(
                this.target,
                this.source,
                this.displacement.scale(-1),
                this.resolved
            );
        }
        hasOverlap() {
            return !this.displacement.isZero();
        }
        isLeft() {
            return this.displacement.x > 0;
        }
        isRight() {
            return this.displacement.x < 0;
        }
        isTop() {
            return this.displacement.y > 0;
        }
        isBottom() {
            return this.displacement.y < 0;
        }
        preventResolution() {
            this.resolved = !0;
        }
    }
    function ri() {
        let e = {},
            n = r.hashGridSize || Ai,
            s = new be(),
            i = [];
        function a(u) {
            if (
                (i.push(s.clone()),
                u.pos && s.translate(u.pos),
                u.scale && s.scale(u.scale),
                u.angle && s.rotate(u.angle),
                (u.transform = s.clone()),
                u.c("area") && !u.paused)
            ) {
                let f = u,
                    m = f.worldArea().bbox(),
                    h = Math.floor(m.pos.x / n),
                    g = Math.floor(m.pos.y / n),
                    E = Math.ceil((m.pos.x + m.width) / n),
                    M = Math.ceil((m.pos.y + m.height) / n),
                    F = new Set();
                for (let _ = h; _ <= E; _++)
                    for (let D = g; D <= M; D++)
                        if (!e[_]) (e[_] = {}), (e[_][D] = [f]);
                        else if (!e[_][D]) e[_][D] = [f];
                        else {
                            let P = e[_][D];
                            e: for (let se of P) {
                                if (se.paused || !se.exists() || F.has(se.id))
                                    continue;
                                for (let N of f.collisionIgnore)
                                    if (se.is(N)) continue e;
                                for (let N of se.collisionIgnore)
                                    if (f.is(N)) continue e;
                                let Y = Ts(f.worldArea(), se.worldArea());
                                if (Y) {
                                    let N = new xn(f, se, Y);
                                    f.trigger("collideUpdate", se, N);
                                    let I = N.reverse();
                                    (I.resolved = N.resolved),
                                        se.trigger("collideUpdate", f, I);
                                }
                                F.add(se.id);
                            }
                            P.push(f);
                        }
            }
            u.children.forEach(a), (s = i.pop());
        }
        o(a, "checkObj"), a(A.root);
    }
    o(ri, "checkFrame");
    function ii() {
        let e = A.cam,
            n = y.fromAngle(wt(0, 360)).scale(e.shake);
        (e.shake = Se(e.shake, 0, 5 * Ue())),
            (e.transform = new be()
                .translate(kt())
                .scale(e.scale)
                .rotate(e.angle)
                .translate((e.pos ?? kt()).scale(-1).add(n))),
            A.root.draw(),
            me();
    }
    o(ii, "drawFrame");
    function oi() {
        let e = Ce();
        A.events.numListeners("loading") > 0
            ? A.events.trigger("loading", e)
            : Fe(() => {
                  let n = ge() / 2,
                      s = 24,
                      i = C(ge() / 2, we() / 2).sub(C(n / 2, s / 2));
                  xe({
                      pos: C(0),
                      width: ge(),
                      height: we(),
                      color: W(0, 0, 0),
                  }),
                      xe({
                          pos: i,
                          width: n,
                          height: s,
                          fill: !1,
                          outline: { width: 4 },
                      }),
                      xe({ pos: i, width: n * e, height: s });
              });
    }
    o(oi, "drawLoadScreen");
    function ds(e, n) {
        Fe(() => {
            let s = C(8);
            V(), l(e);
            let i = Ve({
                    text: n,
                    font: zt,
                    size: 16,
                    pos: s,
                    color: W(255, 255, 255),
                    fixed: !0,
                }),
                a = i.width + s.x * 2,
                u = i.height + s.x * 2;
            e.x + a >= ge() && l(C(-a, 0)),
                e.y + u >= we() && l(C(0, -u)),
                xe({
                    width: a,
                    height: u,
                    color: W(0, 0, 0),
                    radius: 4,
                    opacity: 0.8,
                    fixed: !0,
                }),
                ke(i),
                ee();
        });
    }
    o(ds, "drawInspectText");
    function ai() {
        if (te.inspect) {
            let e = null;
            for (let n of A.root.get("*", { recursive: !0 }))
                if (n.c("area") && n.isHovering()) {
                    e = n;
                    break;
                }
            if ((A.root.drawInspect(), e)) {
                let n = [],
                    s = e.inspect();
                for (let i in s)
                    s[i] ? n.push(`${i}: ${s[i]}`) : n.push(`${i}`);
                ds(
                    er(Gt()),
                    n.join(`
`)
                );
            }
            ds(C(8), `FPS: ${te.fps()}`);
        }
        te.paused &&
            Fe(() => {
                V(), l(ge(), 0), l(-8, 8);
                let e = 32;
                xe({
                    width: e,
                    height: e,
                    anchor: "topright",
                    color: W(0, 0, 0),
                    opacity: 0.8,
                    radius: 4,
                    fixed: !0,
                });
                for (let n = 1; n <= 2; n++)
                    xe({
                        width: 4,
                        height: e * 0.6,
                        anchor: "center",
                        pos: C((-e / 3) * n, e * 0.5),
                        color: W(255, 255, 255),
                        radius: 2,
                        fixed: !0,
                    });
                ee();
            }),
            te.timeScale !== 1 &&
                Fe(() => {
                    V(), l(ge(), we()), l(-8, -8);
                    let e = 8,
                        n = Ve({
                            text: te.timeScale.toFixed(1),
                            font: zt,
                            size: 16,
                            color: W(255, 255, 255),
                            pos: C(-e),
                            anchor: "botright",
                            fixed: !0,
                        });
                    xe({
                        width: n.width + e * 2 + e * 4,
                        height: n.height + e * 2,
                        anchor: "botright",
                        color: W(0, 0, 0),
                        opacity: 0.8,
                        radius: 4,
                        fixed: !0,
                    });
                    for (let s = 0; s < 2; s++) {
                        let i = te.timeScale < 1;
                        qn({
                            p1: C(-n.width - e * (i ? 2 : 3.5), -e),
                            p2: C(-n.width - e * (i ? 2 : 3.5), -e - n.height),
                            p3: C(
                                -n.width - e * (i ? 3.5 : 2),
                                -e - n.height / 2
                            ),
                            pos: C(-s * e * 1 + (i ? -e * 0.5 : 0), 0),
                            color: W(255, 255, 255),
                            fixed: !0,
                        });
                    }
                    ke(n), ee();
                }),
            te.curRecording &&
                Fe(() => {
                    V(),
                        l(0, we()),
                        l(24, -24),
                        ze({
                            radius: 12,
                            color: W(255, 0, 0),
                            opacity: Pn(0, 1, U.time() * 4),
                            fixed: !0,
                        }),
                        ee();
                }),
            te.showLog &&
                A.logs.length > 0 &&
                Fe(() => {
                    V(), l(0, we()), l(8, -8);
                    let e = 8,
                        n = [];
                    for (let i of A.logs) {
                        let a = "",
                            u = i.msg instanceof Error ? "error" : "info";
                        (a += `[time]${i.time.toFixed(2)}[/time]`),
                            (a += " "),
                            (a += `[${u}]${
                                i.msg?.toString ? i.msg.toString() : i.msg
                            }[/${u}]`),
                            n.push(a);
                    }
                    A.logs = A.logs.filter(
                        (i) => U.time() - i.time < (r.logTime || Pi)
                    );
                    let s = Ve({
                        text: n.join(`
`),
                        font: zt,
                        pos: C(e, -e),
                        anchor: "botleft",
                        size: 16,
                        width: ge() * 0.6,
                        lineSpacing: e / 2,
                        fixed: !0,
                        styles: {
                            time: { color: W(127, 127, 127) },
                            info: { color: W(255, 255, 255) },
                            error: { color: W(255, 0, 127) },
                        },
                    });
                    xe({
                        width: s.width + e * 2,
                        height: s.height + e * 2,
                        anchor: "botleft",
                        color: W(0, 0, 0),
                        radius: 4,
                        opacity: 0.8,
                        fixed: !0,
                    }),
                        ke(s),
                        ee();
                });
    }
    o(ai, "drawDebug"), r.debug !== !1 && ss(), r.burp && rs();
    function ui(e) {
        A.events.on("loading", e);
    }
    o(ui, "onLoading");
    function ci(e) {
        U.onResize(e);
    }
    o(ci, "onResize");
    function li(e) {
        A.events.on("error", e);
    }
    o(li, "onError");
    function Un(e) {
        ne.ctx.suspend(),
            U.run(() => {
                Fe(() => {
                    let i = ge(),
                        a = we(),
                        u = {
                            size: 36,
                            width: i - 32 * 2,
                            letterSpacing: 4,
                            lineSpacing: 4,
                            font: zt,
                            fixed: !0,
                        };
                    xe({ width: i, height: a, color: W(0, 0, 255), fixed: !0 });
                    let f = Ve({
                        ...u,
                        text: "Error",
                        pos: C(32),
                        color: W(255, 128, 0),
                        fixed: !0,
                    });
                    ke(f),
                        Qn({
                            ...u,
                            text: e.message,
                            pos: C(32, 32 + f.height + 16),
                            fixed: !0,
                        }),
                        ee(),
                        A.events.trigger("error", e);
                });
            });
    }
    o(Un, "handleErr");
    function hi(e) {
        J.push(e);
    }
    o(hi, "onCleanup");
    function di() {
        A.events.onOnce("frameEnd", () => {
            U.quit();
            for (let n in Ye) window.removeEventListener(n, Ye[n]);
            d.clear(
                d.COLOR_BUFFER_BIT | d.DEPTH_BUFFER_BIT | d.STENCIL_BUFFER_BIT
            );
            let e = d.getParameter(d.MAX_TEXTURE_IMAGE_UNITS);
            for (let n = 0; n < e; n++)
                d.activeTexture(d.TEXTURE0 + n),
                    d.bindTexture(d.TEXTURE_2D, null),
                    d.bindTexture(d.TEXTURE_CUBE_MAP, null);
            d.bindBuffer(d.ARRAY_BUFFER, null),
                d.bindBuffer(d.ELEMENT_ARRAY_BUFFER, null),
                d.bindRenderbuffer(d.RENDERBUFFER, null),
                d.bindFramebuffer(d.FRAMEBUFFER, null),
                J.forEach((n) => n()),
                d.deleteBuffer(v.vbuf),
                d.deleteBuffer(v.ibuf);
        });
    }
    o(di, "quit");
    function En(e, n, s, i, a = Ze.linear) {
        let u = 0,
            f = [],
            p = pn(() => {
                u += Ue();
                let m = Math.min(u / s, 1);
                i(Se(e, n, a(m))),
                    m === 1 && (p.cancel(), i(n), f.forEach((h) => h()));
            });
        return {
            get paused() {
                return p.paused;
            },
            set paused(m) {
                p.paused = m;
            },
            onEnd(m) {
                f.push(m);
            },
            then(m) {
                return this.onEnd(m), this;
            },
            cancel() {
                p.cancel();
            },
            finish() {
                p.cancel(), i(n), f.forEach((m) => m());
            },
        };
    }
    o(En, "tween");
    let jt = !0;
    U.run(() => {
        k.loaded ||
            (Ce() === 1 && !jt && ((k.loaded = !0), A.events.trigger("load"))),
            (!k.loaded && r.loadingScreen !== !1) || jt
                ? (Te(), oi(), Mt())
                : (te.paused || hs(),
                  ri(),
                  Te(),
                  ii(),
                  r.debug !== !1 && ai(),
                  Mt()),
            jt && (jt = !1),
            A.events.trigger("frameEnd");
    });
    function fs() {
        let e = j,
            n = d.drawingBufferWidth / e,
            s = d.drawingBufferHeight / e;
        if (U.isFullscreen()) {
            let i = window.innerWidth,
                a = window.innerHeight,
                u = i / a,
                f = n / s;
            if (u > f) {
                let p = window.innerHeight * f;
                v.viewport = { x: (i - p) / 2, y: 0, width: p, height: a };
            } else {
                let p = window.innerWidth / f;
                v.viewport = { x: 0, y: (a - p) / 2, width: i, height: p };
            }
            return;
        }
        if (r.letterbox) {
            if (!r.width || !r.height)
                throw new O("Letterboxing requires width and height defined.");
            let i = n / s,
                a = r.width / r.height;
            if (i > a) {
                let u = s * a,
                    f = (n - u) / 2;
                v.viewport = { x: f, y: 0, width: u, height: s };
            } else {
                let u = n / a,
                    f = (s - u) / 2;
                v.viewport = { x: 0, y: f, width: n, height: u };
            }
            return;
        }
        if (r.stretch && (!r.width || !r.height))
            throw new O("Stretching requires width and height defined.");
        v.viewport = { x: 0, y: 0, width: n, height: s };
    }
    o(fs, "updateViewport"),
        U.onHide(() => {
            r.backgroundAudio || ne.ctx.suspend();
        }),
        U.onShow(() => {
            r.backgroundAudio || ne.ctx.resume();
        }),
        U.onResize(() => {
            if (U.isFullscreen()) return;
            let e = r.width && r.height;
            (e && !r.stretch && !r.letterbox) ||
                ((c.width = c.offsetWidth * j),
                (c.height = c.offsetHeight * j),
                fs(),
                e ||
                    (v.frameBuffer.free(),
                    (v.frameBuffer = new Ge(
                        d.drawingBufferWidth,
                        d.drawingBufferHeight
                    )),
                    (v.width = d.drawingBufferWidth / j),
                    (v.height = d.drawingBufferHeight / j)));
        }),
        fs();
    let je = {
        VERSION: Si,
        loadRoot: Xt,
        loadProgress: Ce,
        loadSprite: Le,
        loadSpriteAtlas: xt,
        loadSound: on,
        loadBitmapFont: en,
        loadFont: Zt,
        loadShader: sn,
        loadShaderURL: rn,
        loadAseprite: nn,
        loadPedit: tn,
        loadBean: an,
        loadJSON: Qt,
        load: tt,
        getSprite: Et,
        getSound: St,
        getFont: Ct,
        getBitmapFont: Tt,
        getShader: At,
        getAsset: un,
        Asset: re,
        SpriteData: le,
        SoundData: pe,
        width: ge,
        height: we,
        center: kt,
        dt: Ue,
        time: U.time,
        screenshot: U.screenshot,
        record: Wr,
        isFocused: Jr,
        setCursor: U.setCursor,
        getCursor: U.getCursor,
        setCursorLocked: U.setCursorLocked,
        isCursorLocked: U.isCursorLocked,
        setFullscreen: U.setFullscreen,
        isFullscreen: U.isFullscreen,
        isTouchscreen: U.isTouchscreen,
        onLoad: bn,
        onLoading: ui,
        onResize: ci,
        onGamepadConnect: U.onGamepadConnect,
        onGamepadDisconnect: U.onGamepadDisconnect,
        onError: li,
        onCleanup: hi,
        camPos: tr,
        camScale: nr,
        camRot: sr,
        shake: rr,
        toScreen: es,
        toWorld: ts,
        setGravity: mr,
        getGravity: pr,
        setBackground: gr,
        getBackground: wr,
        getGamepads: U.getGamepads,
        add: dt,
        make: mn,
        destroy: Qr,
        destroyAll: ei,
        get: yn,
        readd: Zr,
        pos: It,
        scale: Vt,
        rotate: vr,
        color: br,
        opacity: yr,
        anchor: wn,
        area: Tr,
        sprite: vn,
        text: Ar,
        rect: Or,
        circle: Mr,
        uvquad: Pr,
        outline: Rr,
        body: Fr,
        doubleJump: Br,
        shader: Lr,
        timer: is,
        fixed: Ir,
        stay: os,
        health: Vr,
        lifespan: kr,
        z: xr,
        move: Er,
        offscreen: Cr,
        follow: Ur,
        state: jr,
        fadeIn: Nr,
        mask: _r,
        tile: cs,
        agent: Xr,
        on: Be,
        onUpdate: pn,
        onDraw: ir,
        onAdd: gn,
        onDestroy: ns,
        onClick: cr,
        onCollide: or,
        onCollideUpdate: ar,
        onCollideEnd: ur,
        onHover: lr,
        onHoverUpdate: hr,
        onHoverEnd: dr,
        onKeyDown: U.onKeyDown,
        onKeyPress: U.onKeyPress,
        onKeyPressRepeat: U.onKeyPressRepeat,
        onKeyRelease: U.onKeyRelease,
        onMouseDown: U.onMouseDown,
        onMousePress: U.onMousePress,
        onMouseRelease: U.onMouseRelease,
        onMouseMove: U.onMouseMove,
        onCharInput: U.onCharInput,
        onTouchStart: U.onTouchStart,
        onTouchMove: U.onTouchMove,
        onTouchEnd: U.onTouchEnd,
        onScroll: U.onScroll,
        onHide: U.onHide,
        onShow: U.onShow,
        onGamepadButtonDown: U.onGamepadButtonDown,
        onGamepadButtonPress: U.onGamepadButtonPress,
        onGamepadButtonRelease: U.onGamepadButtonRelease,
        onGamepadStick: U.onGamepadStick,
        mousePos: Gt,
        mouseDeltaPos: U.mouseDeltaPos,
        isKeyDown: U.isKeyDown,
        isKeyPressed: U.isKeyPressed,
        isKeyPressedRepeat: U.isKeyPressedRepeat,
        isKeyReleased: U.isKeyReleased,
        isMouseDown: U.isMouseDown,
        isMousePressed: U.isMousePressed,
        isMouseReleased: U.isMouseReleased,
        isMouseMoved: U.isMouseMoved,
        isGamepadButtonPressed: U.isGamepadButtonPressed,
        isGamepadButtonDown: U.isGamepadButtonDown,
        isGamepadButtonReleased: U.isGamepadButtonReleased,
        charInputted: U.charInputted,
        loop: fr,
        wait: Lt,
        play: Ot,
        volume: hn,
        burp: it,
        audioCtx: ne.ctx,
        Timer: bt,
        Line: Pe,
        Rect: he,
        Circle: gt,
        Polygon: _e,
        Vec2: y,
        Color: $,
        Mat4: be,
        Quad: oe,
        RNG: mt,
        rand: wt,
        randi: Mn,
        randSeed: vs,
        vec2: C,
        rgb: W,
        hsl2rgb: ws,
        quad: ae,
        choose: ys,
        chance: bs,
        lerp: Se,
        tween: En,
        easings: Ze,
        map: Nt,
        mapc: gs,
        wave: Pn,
        deg2rad: Ee,
        rad2deg: Je,
        clamp: Me,
        testLineLine: We,
        testRectRect: xs,
        testRectLine: Us,
        testRectPoint: pt,
        testCirclePolygon: Cs,
        testLinePoint: Es,
        testLineCircle: Rn,
        drawSprite: at,
        drawText: Qn,
        formatText: Ve,
        drawRect: xe,
        drawLine: ct,
        drawLines: Hn,
        drawTriangle: qn,
        drawCircle: ze,
        drawEllipse: $n,
        drawUVQuad: z,
        drawPolygon: Ie,
        drawFormattedText: ke,
        drawMasked: zn,
        drawSubtracted: Yn,
        pushTransform: V,
        popTransform: ee,
        pushTranslate: l,
        pushScale: x,
        pushRotate: T,
        pushMatrix: Dt,
        usePostEffect: Pt,
        debug: te,
        scene: Hr,
        go: qr,
        onSceneLeave: $r,
        addLevel: Yr,
        getData: Kr,
        setData: as,
        download: Ht,
        downloadJSON: Os,
        downloadText: Fn,
        downloadBlob: Bn,
        plug: us,
        ASCII_CHARS: ks,
        canvas: U.canvas(),
        addKaboom: si,
        LEFT: y.LEFT,
        RIGHT: y.RIGHT,
        UP: y.UP,
        DOWN: y.DOWN,
        RED: $.RED,
        GREEN: $.GREEN,
        BLUE: $.BLUE,
        YELLOW: $.YELLOW,
        MAGENTA: $.MAGENTA,
        CYAN: $.CYAN,
        WHITE: $.WHITE,
        BLACK: $.BLACK,
        quit: di,
        Event: ve,
        EventHandler: De,
        EventController: Re,
        KaboomError: O,
    };
    if ((r.plugins && r.plugins.forEach(us), r.global !== !1))
        for (let e in je) window[e] = je[e];
    return U.canvas().focus(), je;
}, "default");
export { po as default };
//# sourceMappingURL=kaboom.mjs.map
