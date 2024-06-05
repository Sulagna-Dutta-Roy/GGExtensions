'use strict';

function cubicSolve(a, b, c, d) {
    b /= a;
    c /= a;
    d /= a;

    let s, t;
    let q = (3.0 * c - (b * b)) / 9.0;
    const r = (-(27.0 * d) + b * (9.0 * c - 2.0 * (b * b))) / 54.0;
    const discrim = q * q * q + r * r;

    const roots = [
        { real: 0, i: 0 },
        { real: 0, i: 0 },
        { real: 0, i: 0 }
    ];

    const term1 = b / 3.0;

    if (discrim > 0) {
        const temp = 1.0 / 3.0;
        s = r + Math.sqrt(discrim);
        s = ((s < 0) ? -Math.pow(-s, temp) : Math.pow(s, temp));
        t = r - Math.sqrt(discrim);
        t = ((t < 0) ? -Math.pow(-t, temp) : Math.pow(t, temp));

        roots[0].real = -term1 + s + t;
        roots[2].real = roots[1].real = -(term1 + ((s + t) / 2.0));
        roots[1].i = Math.sqrt(3.0) * (-t + s) / 2;
        roots[2].i = -roots[1].i;
    } else if (discrim === 0) {
        const r13 = (r < 0) ? -Math.pow(-r, (1.0 / 3.0)) : Math.pow(r, (1.0 / 3.0));
        roots[0].real = -term1 + 2.0 * r13;
        roots[2].real = roots[1].real = -(r13 + term1);
    } else {
        const dum1 = Math.acos(r / Math.sqrt(-q * -q * -q));
        const temp = -term1 + 2.0 * Math.sqrt(-q);
        roots[0].real = temp * Math.cos(dum1 / 3.0);
        roots[1].real = temp * Math.cos((dum1 + 2.0 * Math.PI) / 3.0);
        roots[2].real = temp * Math.cos((dum1 + 4.0 * Math.PI) / 3.0);
    }
    return roots;
}
