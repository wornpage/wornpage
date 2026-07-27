var Js = Object.defineProperty;
var oi = (e) => {
  throw TypeError(e);
};
var Ks = (e, t, r) => t in e ? Js(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var P = (e, t, r) => Ks(e, typeof t != "symbol" ? t + "" : t, r), pn = (e, t, r) => t.has(e) || oi("Cannot " + r);
var a = (e, t, r) => (pn(e, t, "read from private field"), r ? r.call(e) : t.get(e)), E = (e, t, r) => t.has(e) ? oi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), $ = (e, t, r, n) => (pn(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), A = (e, t, r) => (pn(e, t, "access private method"), r);
var $i;
typeof window < "u" && (($i = window.__svelte ?? (window.__svelte = {})).v ?? ($i.v = /* @__PURE__ */ new Set())).add("5");
const Ws = 1, Xs = 2, Zs = 16, Qs = 1, el = 4, tl = 8, rl = 16, nl = 1, il = 2, Si = "[", Fn = "[!", ai = "[?", Hn = "]", At = {}, V = Symbol("uninitialized"), ki = "http://www.w3.org/1999/xhtml", sl = "http://www.w3.org/2000/svg", ll = "http://www.w3.org/1998/Math/MathML", Ti = !1;
var Ai = Array.isArray, ol = Array.prototype.indexOf, Gr = Array.prototype.includes, ln = Array.from, Jr = Object.keys, Kr = Object.defineProperty, Et = Object.getOwnPropertyDescriptor, al = Object.getOwnPropertyDescriptors, fl = Object.prototype, ul = Array.prototype, Ni = Object.getPrototypeOf, fi = Object.isExtensible;
const Ri = () => {
};
function cl(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function Ci() {
  var e, t, r = new Promise((n, i) => {
    e = n, t = i;
  });
  return { promise: r, resolve: e, reject: t };
}
const U = 2, Jt = 4, on = 8, Oi = 1 << 24, Ie = 16, Te = 32, qe = 64, xn = 128, ke = 512, Y = 1024, j = 2048, De = 4096, ee = 8192, _e = 16384, Ct = 32768, En = 1 << 25, Kt = 65536, Wr = 1 << 17, dl = 1 << 18, Ot = 1 << 19, vl = 1 << 20, et = 1 << 25, Nt = 65536, Xr = 1 << 21, zt = 1 << 22, vt = 1 << 23, dr = Symbol("$state"), Mi = Symbol("legacy props"), hl = Symbol(""), jr = Symbol("attributes"), Sn = Symbol("class"), kn = Symbol("style"), lr = Symbol("text"), vr = Symbol("form reset"), kr = new class extends Error {
  constructor() {
    super(...arguments);
    P(this, "name", "StaleReactionError");
    P(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
  }
}();
var xi;
const pl = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!((xi = globalThis.document) != null && xi.contentType) && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
), an = 3, er = 8;
function _l() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function gl(e, t, r) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function wl(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function bl() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function ml(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function yl() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function $l() {
  throw new Error("https://svelte.dev/e/hydration_failed");
}
function xl(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function El() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Sl() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function kl() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Tl() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
function Al() {
  console.warn("https://svelte.dev/e/derived_inert");
}
function Tr(e) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Nl() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
let C = !1;
function tt(e) {
  C = e;
}
let T;
function ne(e) {
  if (e === null)
    throw Tr(), At;
  return T = e;
}
function Wt() {
  return ne(/* @__PURE__ */ Fe(T));
}
function Z(e) {
  if (C) {
    if (/* @__PURE__ */ Fe(T) !== null)
      throw Tr(), At;
    T = e;
  }
}
function or(e = 1) {
  if (C) {
    for (var t = e, r = T; t--; )
      r = /** @type {TemplateNode} */
      /* @__PURE__ */ Fe(r);
    T = r;
  }
}
function Zr(e = !0) {
  for (var t = 0, r = T; ; ) {
    if (r.nodeType === er) {
      var n = (
        /** @type {Comment} */
        r.data
      );
      if (n === Hn) {
        if (t === 0) return r;
        t -= 1;
      } else (n === Si || n === Fn || // "[1", "[2", etc. for if blocks
      n[0] === "[" && !isNaN(Number(n.slice(1)))) && (t += 1);
    }
    var i = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ Fe(r)
    );
    e && r.remove(), r = i;
  }
}
function Ii(e) {
  if (!e || e.nodeType !== er)
    throw Tr(), At;
  return (
    /** @type {Comment} */
    e.data
  );
}
function Li(e) {
  return e === this.v;
}
function Rl(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function Di(e) {
  return !Rl(e, this.v);
}
let Cl = !1, te = null;
function Xt(e) {
  te = e;
}
function zn(e, t = !1, r) {
  te = {
    p: te,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: (
      /** @type {Effect} */
      k
    ),
    l: null
  };
}
function jn(e) {
  var t = (
    /** @type {ComponentContext} */
    te
  ), r = t.e;
  if (r !== null) {
    t.e = null;
    for (var n of r)
      us(n);
  }
  return e !== void 0 && (t.x = e), t.i = !0, te = t.p, e ?? /** @type {T} */
  {};
}
function Pi() {
  return !0;
}
let _t = [];
function Fi() {
  var e = _t;
  _t = [], cl(e);
}
function ut(e) {
  if (_t.length === 0 && !pr) {
    var t = _t;
    queueMicrotask(() => {
      t === _t && Fi();
    });
  }
  _t.push(e);
}
function Ol() {
  for (; _t.length > 0; )
    Fi();
}
function Hi(e) {
  var t = k;
  if (t === null)
    return N.f |= vt, e;
  if ((t.f & Ct) === 0 && (t.f & Jt) === 0)
    throw e;
  ct(e, t);
}
function ct(e, t) {
  if (!(t !== null && (t.f & _e) !== 0)) {
    for (; t !== null; ) {
      if ((t.f & xn) !== 0) {
        if ((t.f & Ct) === 0)
          throw e;
        try {
          t.b.error(e);
          return;
        } catch (r) {
          e = r;
        }
      }
      t = t.parent;
    }
    throw e;
  }
}
const Ml = -7169;
function H(e, t) {
  e.f = e.f & Ml | t;
}
function Bn(e) {
  (e.f & ke) !== 0 || e.deps === null ? H(e, Y) : H(e, De);
}
function zi(e) {
  if (e !== null)
    for (const t of e)
      (t.f & U) === 0 || (t.f & Nt) === 0 || (t.f ^= Nt, zi(
        /** @type {Derived} */
        t.deps
      ));
}
function ji(e, t, r) {
  (e.f & j) !== 0 ? t.add(e) : (e.f & De) !== 0 && r.add(e), zi(e.deps), H(e, Y);
}
let Pr = !1;
function Il(e) {
  var t = Pr;
  try {
    return Pr = !1, [e(), Pr];
  } finally {
    Pr = t;
  }
}
let ui = !1;
function Bi() {
  ui || (ui = !0, document.addEventListener(
    "reset",
    (e) => {
      Promise.resolve().then(() => {
        var t;
        if (!e.defaultPrevented)
          for (
            const r of
            /**@type {HTMLFormElement} */
            e.target.elements
          )
            (t = r[vr]) == null || t.call(r);
      });
    },
    // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
    { capture: !0 }
  ));
}
function Ar(e) {
  var t = N, r = k;
  Ae(null), Ue(null);
  try {
    return e();
  } finally {
    Ae(t), Ue(r);
  }
}
function Ll(e, t, r, n = r) {
  e.addEventListener(t, () => Ar(r));
  const i = (
    /** @type {any} */
    e[vr]
  );
  i ? e[vr] = () => {
    i(), n(!0);
  } : e[vr] = () => n(!0), Bi();
}
function Dl(e) {
  let t = 0, r = Rt(0), n;
  return () => {
    Gn() && (g(r), Nr(() => (t === 0 && (n = un(() => e(() => _r(r)))), t += 1, () => {
      ut(() => {
        t -= 1, t === 0 && (n == null || n(), n = void 0, _r(r));
      });
    })));
  };
}
var Pl = Kt | Ot;
function Fl(e, t, r, n) {
  new Hl(e, t, r, n);
}
var ve, mr, ye, bt, ae, $e, Q, he, Ke, mt, at, jt, yr, $r, We, rn, L, Vi, Yi, Tn, qi, An, Br, Vr, Nn, Rn;
class Hl {
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(t, r, n, i) {
    E(this, L);
    /** @type {Boundary | null} */
    P(this, "parent");
    P(this, "is_pending", !1);
    /**
     * API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
     * Inherited from parent boundary, or defaults to identity.
     * @type {(error: unknown) => unknown}
     */
    P(this, "transform_error");
    /** @type {TemplateNode} */
    E(this, ve);
    /** @type {TemplateNode | null} */
    E(this, mr, C ? T : null);
    /** @type {BoundaryProps} */
    E(this, ye);
    /** @type {((anchor: Node) => void)} */
    E(this, bt);
    /** @type {Effect} */
    E(this, ae);
    /** @type {Effect | null} */
    E(this, $e, null);
    /** @type {Effect | null} */
    E(this, Q, null);
    /** @type {Effect | null} */
    E(this, he, null);
    /** @type {DocumentFragment | null} */
    E(this, Ke, null);
    E(this, mt, 0);
    E(this, at, 0);
    E(this, jt, !1);
    /** @type {Set<Effect>} */
    E(this, yr, /* @__PURE__ */ new Set());
    /** @type {Set<Effect>} */
    E(this, $r, /* @__PURE__ */ new Set());
    /**
     * A source containing the number of pending async deriveds/expressions.
     * Only created if `$effect.pending()` is used inside the boundary,
     * otherwise updating the source results in needless `Batch.ensure()`
     * calls followed by no-op flushes
     * @type {Source<number> | null}
     */
    E(this, We, null);
    E(this, rn, Dl(() => ($(this, We, Rt(a(this, mt))), () => {
      $(this, We, null);
    })));
    var s;
    $(this, ve, t), $(this, ye, r), $(this, bt, (o) => {
      var l = (
        /** @type {Effect} */
        k
      );
      l.b = this, l.f |= xn, n(o);
    }), this.parent = /** @type {Effect} */
    k.b, this.transform_error = i ?? ((s = this.parent) == null ? void 0 : s.transform_error) ?? ((o) => o), $(this, ae, Jn(() => {
      if (C) {
        const o = (
          /** @type {Comment} */
          a(this, mr)
        );
        Wt();
        const l = o.data === Fn;
        if (o.data.startsWith(ai)) {
          const u = JSON.parse(o.data.slice(ai.length));
          A(this, L, Yi).call(this, u);
        } else l ? A(this, L, qi).call(this) : A(this, L, Vi).call(this);
      } else
        A(this, L, An).call(this);
    }, Pl)), C && $(this, ve, T);
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(t) {
    ji(t, a(this, yr), a(this, $r));
  }
  /**
   * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!a(this, ye).pending;
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  update_pending_count(t, r) {
    A(this, L, Nn).call(this, t, r), $(this, mt, a(this, mt) + t), !(!a(this, We) || a(this, jt)) && ($(this, jt, !0), ut(() => {
      $(this, jt, !1), a(this, We) && Zt(a(this, We), a(this, mt));
    }));
  }
  get_effect_pending() {
    return a(this, rn).call(this), g(
      /** @type {Source<number>} */
      a(this, We)
    );
  }
  /** @param {unknown} error */
  error(t) {
    if (!a(this, ye).onerror && !a(this, ye).failed)
      throw t;
    y != null && y.is_fork ? (a(this, $e) && y.skip_effect(a(this, $e)), a(this, Q) && y.skip_effect(a(this, Q)), a(this, he) && y.skip_effect(a(this, he)), y.oncommit(() => {
      A(this, L, Rn).call(this, t);
    })) : A(this, L, Rn).call(this, t);
  }
}
ve = new WeakMap(), mr = new WeakMap(), ye = new WeakMap(), bt = new WeakMap(), ae = new WeakMap(), $e = new WeakMap(), Q = new WeakMap(), he = new WeakMap(), Ke = new WeakMap(), mt = new WeakMap(), at = new WeakMap(), jt = new WeakMap(), yr = new WeakMap(), $r = new WeakMap(), We = new WeakMap(), rn = new WeakMap(), L = new WeakSet(), Vi = function() {
  try {
    $(this, $e, Ee(() => a(this, bt).call(this, a(this, ve))));
  } catch (t) {
    this.error(t);
  }
}, /**
 * @param {unknown} error The deserialized error from the server's hydration comment
 */
Yi = function(t) {
  const r = a(this, ye).failed, { reset: n, invoke_onerror: i } = A(this, L, Tn).call(this, t);
  ut(i), r && $(this, he, Ee(() => {
    r(
      a(this, ve),
      () => t,
      () => n
    );
  }));
}, /**
 * Creates the `reset` function for a failed boundary, along with a function
 * that invokes `onerror` with it (if provided)
 * @param {unknown} error
 * @returns {{ reset: () => void, invoke_onerror: () => void }}
 */
Tn = function(t) {
  var r = !1, n = !1;
  const i = () => {
    if (r) {
      Nl();
      return;
    }
    r = !0, n && Tl(), a(this, he) !== null && kt(a(this, he), () => {
      $(this, he, null);
    }), A(this, L, Vr).call(this, () => {
      A(this, L, An).call(this);
    });
  };
  return { reset: i, invoke_onerror: () => {
    var o, l;
    try {
      n = !0, (l = (o = a(this, ye)).onerror) == null || l.call(o, t, i), n = !1;
    } catch (f) {
      ct(f, a(this, ae) && a(this, ae).parent);
    }
  } };
}, qi = function() {
  const t = a(this, ye).pending;
  t && (this.is_pending = !0, $(this, Q, Ee(() => t(a(this, ve)))), ut(() => {
    var r = $(this, Ke, document.createDocumentFragment()), n = Pe();
    r.append(n), $(this, $e, A(this, L, Vr).call(this, () => Ee(() => a(this, bt).call(this, n)))), a(this, at) === 0 && (a(this, ve).before(r), $(this, Ke, null), kt(
      /** @type {Effect} */
      a(this, Q),
      () => {
        $(this, Q, null);
      }
    ), A(this, L, Br).call(
      this,
      /** @type {Batch} */
      y
    ));
  }));
}, An = function() {
  try {
    if (this.is_pending = this.has_pending_snippet(), $(this, at, 0), $(this, mt, 0), $(this, $e, Ee(() => {
      a(this, bt).call(this, a(this, ve));
    })), a(this, at) > 0) {
      var t = $(this, Ke, document.createDocumentFragment());
      Wn(a(this, $e), t);
      const r = (
        /** @type {(anchor: Node) => void} */
        a(this, ye).pending
      );
      $(this, Q, Ee(() => r(a(this, ve))));
    } else
      A(this, L, Br).call(
        this,
        /** @type {Batch} */
        y
      );
  } catch (r) {
    this.error(r);
  }
}, /**
 * @param {Batch} batch
 */
Br = function(t) {
  this.is_pending = !1, t.transfer_effects(a(this, yr), a(this, $r));
}, /**
 * @template T
 * @param {() => T} fn
 */
Vr = function(t) {
  var r = k, n = N, i = te;
  Ue(a(this, ae)), Ae(a(this, ae)), Xt(a(this, ae).ctx);
  try {
    return ht.ensure(), t();
  } catch (s) {
    return Hi(s), null;
  } finally {
    Ue(r), Ae(n), Xt(i);
  }
}, /**
 * Updates the pending count associated with the currently visible pending snippet,
 * if any, such that we can replace the snippet with content once work is done
 * @param {1 | -1} d
 * @param {Batch} batch
 */
Nn = function(t, r) {
  var n;
  if (!this.has_pending_snippet()) {
    this.parent && A(n = this.parent, L, Nn).call(n, t, r);
    return;
  }
  $(this, at, a(this, at) + t), a(this, at) === 0 && (A(this, L, Br).call(this, r), a(this, Q) && kt(a(this, Q), () => {
    $(this, Q, null);
  }), a(this, Ke) && (a(this, ve).before(a(this, Ke)), $(this, Ke, null)));
}, /**
 * @param {unknown} error
 */
Rn = function(t) {
  a(this, $e) && (re(a(this, $e)), $(this, $e, null)), a(this, Q) && (re(a(this, Q)), $(this, Q, null)), a(this, he) && (re(a(this, he)), $(this, he, null)), C && (ne(
    /** @type {TemplateNode} */
    a(this, mr)
  ), or(), ne(Zr()));
  let r = a(this, ye).failed;
  const n = (i) => {
    const { reset: s, invoke_onerror: o } = A(this, L, Tn).call(this, i);
    o(), r && $(this, he, A(this, L, Vr).call(this, () => {
      try {
        return Ee(() => {
          var l = (
            /** @type {Effect} */
            k
          );
          l.b = this, l.f |= xn, r(
            a(this, ve),
            () => i,
            () => s
          );
        });
      } catch (l) {
        return ct(
          l,
          /** @type {Effect} */
          a(this, ae).parent
        ), null;
      }
    }));
  };
  ut(() => {
    var i;
    try {
      i = this.transform_error(t);
    } catch (s) {
      ct(s, a(this, ae) && a(this, ae).parent);
      return;
    }
    i !== null && typeof i == "object" && typeof /** @type {any} */
    i.then == "function" ? i.then(
      n,
      /** @param {unknown} e */
      (s) => ct(s, a(this, ae) && a(this, ae).parent)
    ) : n(i);
  });
};
function zl(e, t, r, n) {
  const i = wr;
  var s = e.filter((_) => !_.settled), o = t.map(i);
  if (r.length === 0 && s.length === 0) {
    n(o);
    return;
  }
  var l = (
    /** @type {Effect} */
    k
  ), f = jl(), u = s.length === 1 ? s[0].promise : s.length > 1 ? Promise.all(s.map((_) => _.promise)) : null;
  function h(_) {
    if ((l.f & _e) === 0) {
      f();
      try {
        n([...o, ..._]);
      } catch (v) {
        ct(v, l);
      }
      Qr();
    }
  }
  var p = Ui();
  if (r.length === 0) {
    u.then(() => h([])).finally(p);
    return;
  }
  function c() {
    Promise.all(r.map((_) => /* @__PURE__ */ Bl(_))).then(h).catch((_) => ct(_, l)).finally(p);
  }
  u ? u.then(() => {
    f(), c(), Qr();
  }) : c();
}
function jl() {
  var e = (
    /** @type {Effect} */
    k
  ), t = N, r = te, n = (
    /** @type {Batch} */
    y
  );
  return function(s = !0) {
    Ue(e), Ae(t), Xt(r), s && (e.f & _e) === 0 && (n == null || n.activate(), n == null || n.apply());
  };
}
function Qr(e = !0) {
  Ue(null), Ae(null), Xt(null), e && (y == null || y.deactivate());
}
function Ui() {
  var e = (
    /** @type {Effect} */
    k
  ), t = e.b, r = (
    /** @type {Batch} */
    y
  ), n = !!(t != null && t.is_rendered());
  return t == null || t.update_pending_count(1, r), r.increment(n, e), () => {
    t == null || t.update_pending_count(-1, r), r.decrement(n, e);
  };
}
// @__NO_SIDE_EFFECTS__
function wr(e) {
  var t = U | j;
  return k !== null && (k.f |= Ot), {
    ctx: te,
    deps: null,
    effects: null,
    equals: Li,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      V
    ),
    wv: 0,
    parent: k,
    ac: null
  };
}
const ar = Symbol("obsolete");
// @__NO_SIDE_EFFECTS__
function Bl(e, t, r) {
  let n = (
    /** @type {Effect | null} */
    k
  );
  n === null && _l();
  var i = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), s = Rt(
    /** @type {V} */
    V
  ), o = !N, l = /* @__PURE__ */ new Set();
  return Ql(() => {
    var _, v;
    var f = (
      /** @type {Effect} */
      k
    ), u = Ci();
    i = u.promise;
    try {
      Promise.resolve(e()).then(u.resolve, (b) => {
        b !== kr && u.reject(b);
      }).finally(Qr);
    } catch (b) {
      u.reject(b), Qr();
    }
    var h = (
      /** @type {Batch} */
      y
    );
    if (o) {
      if ((f.f & Ct) !== 0)
        var p = Ui();
      if (
        // boundary can be null if the async derived is inside an $effect.root not connected to the component render tree
        (_ = n.b) != null && _.is_rendered()
      )
        (v = h.async_deriveds.get(f)) == null || v.reject(ar);
      else
        for (const b of l.values())
          b.reject(ar);
      l.add(u), h.async_deriveds.set(f, u);
    }
    const c = (b, S = void 0) => {
      p == null || p(), l.delete(u), S !== ar && (h.activate(), S ? (s.f |= vt, Zt(s, S)) : ((s.f & vt) !== 0 && (s.f ^= vt), Zt(s, b)), h.deactivate());
    };
    u.promise.then(c, (b) => c(null, b || "unknown"));
  }), fs(() => {
    for (const f of l)
      f.reject(ar);
  }), new Promise((f) => {
    function u(h) {
      function p() {
        h === i ? f(s) : u(i);
      }
      h.then(p, p);
    }
    u(i);
  });
}
// @__NO_SIDE_EFFECTS__
function He(e) {
  const t = /* @__PURE__ */ wr(e);
  return gs(t), t;
}
// @__NO_SIDE_EFFECTS__
function Gi(e) {
  const t = /* @__PURE__ */ wr(e);
  return t.equals = Di, t;
}
function Vl(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var r = 0; r < t.length; r += 1)
      re(
        /** @type {Effect} */
        t[r]
      );
  }
}
function Vn(e) {
  var t, r = k, n = e.parent;
  if (!nt && n !== null && e.v !== V && // if it was never evaluated before, it's guaranteed to fail downstream, so we try to execute instead
  (n.f & (_e | ee)) !== 0)
    return Al(), e.v;
  Ue(n);
  try {
    e.f &= ~Nt, Vl(e), t = ys(e);
  } finally {
    Ue(r);
  }
  return t;
}
function Ji(e) {
  var t = Vn(e);
  if (!e.equals(t) && (e.wv = bs(), (!(y != null && y.is_fork) || e.deps === null) && (y !== null ? (y.capture(e, t, !0), hr == null || hr.capture(e, t, !0)) : e.v = t, e.deps === null))) {
    H(e, Y);
    return;
  }
  nt || (J !== null ? (Gn() || y != null && y.is_fork) && J.set(e, t) : Bn(e));
}
function Yl(e) {
  var t;
  if (e.effects !== null)
    for (const r of e.effects)
      (r.teardown || r.ac) && ((t = r.teardown) == null || t.call(r), r.ac !== null && Ar(() => {
        r.ac.abort(kr), r.ac = null;
      }), r.fn !== null && (r.teardown = Ri), br(r, 0), Kn(r));
}
function Ki(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && t.fn !== null && Qt(t);
}
let _n = null, It = null, y = null, hr = null, J = null, Cn = null, pr = !1, gn = !1, Ht = null, Yr = null;
var ci = 0;
let ql = 1;
var Bt, ft, yt, Vt, Yt, qt, Xe, Ut, fe, xr, Ze, Ce, je, Gt, $t, M, On, fr, Mn, Wi, Xi, Pt, Ul, ur;
const nn = class nn {
  constructor() {
    E(this, M);
    P(this, "id", ql++);
    /** True as soon as `#process` was called */
    E(this, Bt, !1);
    P(this, "linked", !0);
    /** @type {Batch | null} */
    E(this, ft, null);
    /** @type {Batch | null} */
    E(this, yt, null);
    /** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
    P(this, "async_deriveds", /* @__PURE__ */ new Map());
    /**
     * The current values of any signals that are updated in this batch.
     * Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
     * They keys of this map are identical to `this.#previous`
     * @type {Map<Value, [any, boolean]>}
     */
    P(this, "current", /* @__PURE__ */ new Map());
    /**
     * The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
     * They keys of this map are identical to `this.#current`
     * @type {Map<Value, any>}
     */
    P(this, "previous", /* @__PURE__ */ new Map());
    /**
     * When the batch is committed (and the DOM is updated), we need to remove old branches
     * and append new ones by calling the functions added inside (if/each/key/etc) blocks
     * @type {Set<(batch: Batch) => void>}
     */
    E(this, Vt, /* @__PURE__ */ new Set());
    /**
     * If a fork is discarded, we need to destroy any effects that are no longer needed
     * @type {Set<(batch: Batch) => void>}
     */
    E(this, Yt, /* @__PURE__ */ new Set());
    /**
     * The number of async effects that are currently in flight
     */
    E(this, qt, 0);
    /**
     * Async effects that are currently in flight, _not_ inside a pending boundary
     * @type {Map<Effect, number>}
     */
    E(this, Xe, /* @__PURE__ */ new Map());
    /**
     * A deferred that resolves when the batch is committed, used with `settled()`
     * TODO replace with Promise.withResolvers once supported widely enough
     * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
     */
    E(this, Ut, null);
    /**
     * The root effects that need to be flushed
     * @type {Effect[]}
     */
    E(this, fe, []);
    /**
     * Effects created while this batch was active.
     * @type {Effect[]}
     */
    E(this, xr, []);
    /**
     * Deferred effects (which run after async work has completed) that are DIRTY
     * @type {Set<Effect>}
     */
    E(this, Ze, /* @__PURE__ */ new Set());
    /**
     * Deferred effects that are MAYBE_DIRTY
     * @type {Set<Effect>}
     */
    E(this, Ce, /* @__PURE__ */ new Set());
    /**
     * A map of branches that still exist, but will be destroyed when this batch
     * is committed — we skip over these during `process`.
     * The value contains child effects that were dirty/maybe_dirty before being reset,
     * so they can be rescheduled if the branch survives.
     * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
     */
    E(this, je, /* @__PURE__ */ new Map());
    /**
     * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
     * @type {Set<Effect>}
     */
    E(this, Gt, /* @__PURE__ */ new Set());
    P(this, "is_fork", !1);
    E(this, $t, !1);
    It === null ? _n = It = this : ($(It, yt, this), $(this, ft, It)), It = this;
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(t) {
    a(this, je).has(t) || a(this, je).set(t, { d: [], m: [] }), a(this, Gt).delete(t);
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   * @param {(e: Effect) => void} callback
   */
  unskip_effect(t, r = (n) => this.schedule(n)) {
    var n = a(this, je).get(t);
    if (n) {
      a(this, je).delete(t);
      for (var i of n.d)
        H(i, j), r(i);
      for (i of n.m)
        H(i, De), r(i);
    }
    a(this, Gt).add(t);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(t, r, n = !1) {
    t.v !== V && !this.previous.has(t) && this.previous.set(t, t.v), (t.f & vt) === 0 && (this.current.set(t, [r, n]), J == null || J.set(t, r)), this.is_fork || (t.v = r);
  }
  activate() {
    y = this;
  }
  deactivate() {
    y = null, J = null;
  }
  flush() {
    try {
      gn = !0, y = this, A(this, M, fr).call(this);
    } finally {
      ci = 0, Cn = null, Ht = null, Yr = null, gn = !1, y = null, J = null, St.clear();
    }
  }
  discard() {
    var t;
    for (const r of a(this, Yt)) r(this);
    a(this, Yt).clear();
    for (const r of this.async_deriveds.values())
      r.reject(ar);
    A(this, M, ur).call(this), (t = a(this, Ut)) == null || t.resolve();
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(t) {
    a(this, xr).push(t);
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  increment(t, r) {
    if ($(this, qt, a(this, qt) + 1), t) {
      let n = a(this, Xe).get(r) ?? 0;
      a(this, Xe).set(r, n + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  decrement(t, r) {
    if ($(this, qt, a(this, qt) - 1), t) {
      let n = a(this, Xe).get(r) ?? 0;
      n === 1 ? a(this, Xe).delete(r) : a(this, Xe).set(r, n - 1);
    }
    a(this, $t) || ($(this, $t, !0), ut(() => {
      $(this, $t, !1), this.linked && this.flush();
    }));
  }
  /**
   * @param {Set<Effect>} dirty_effects
   * @param {Set<Effect>} maybe_dirty_effects
   */
  transfer_effects(t, r) {
    for (const n of t)
      a(this, Ze).add(n);
    for (const n of r)
      a(this, Ce).add(n);
    t.clear(), r.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(t) {
    a(this, Vt).add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    a(this, Yt).add(t);
  }
  settled() {
    return (a(this, Ut) ?? $(this, Ut, Ci())).promise;
  }
  static ensure() {
    if (y === null) {
      const t = y = new nn();
      !gn && !pr && ut(() => {
        a(t, Bt) || t.flush();
      });
    }
    return y;
  }
  apply() {
    {
      J = null;
      return;
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(t) {
    var i;
    if (Cn = t, (i = t.b) != null && i.is_pending && (t.f & (Jt | on | Oi)) !== 0 && (t.f & Ct) === 0) {
      t.b.defer_effect(t);
      return;
    }
    for (var r = t; r.parent !== null; ) {
      r = r.parent;
      var n = r.f;
      if (Ht !== null && r === k && (N === null || (N.f & U) === 0))
        return;
      if ((n & (qe | Te)) !== 0) {
        if ((n & Y) === 0)
          return;
        r.f ^= Y;
      }
    }
    a(this, fe).push(r);
  }
};
Bt = new WeakMap(), ft = new WeakMap(), yt = new WeakMap(), Vt = new WeakMap(), Yt = new WeakMap(), qt = new WeakMap(), Xe = new WeakMap(), Ut = new WeakMap(), fe = new WeakMap(), xr = new WeakMap(), Ze = new WeakMap(), Ce = new WeakMap(), je = new WeakMap(), Gt = new WeakMap(), $t = new WeakMap(), M = new WeakSet(), On = function() {
  if (this.is_fork) return !0;
  for (const n of a(this, Xe).keys()) {
    for (var t = n, r = !1; t.parent !== null; ) {
      if (a(this, je).has(t)) {
        r = !0;
        break;
      }
      t = t.parent;
    }
    if (!r)
      return !0;
  }
  return !1;
}, fr = function() {
  var f, u, h, p;
  $(this, Bt, !0), ci++ > 1e3 && (A(this, M, ur).call(this), Gl());
  for (const c of a(this, Ze))
    a(this, Ce).delete(c), H(c, j), this.schedule(c);
  for (const c of a(this, Ce))
    H(c, De), this.schedule(c);
  const t = a(this, fe);
  $(this, fe, []), this.apply();
  var r = Ht = [], n = [], i = Yr = [];
  for (const c of t)
    try {
      A(this, M, Mn).call(this, c, r, n);
    } catch (_) {
      throw es(c), A(this, M, On).call(this) || this.discard(), _;
    }
  if (y = null, i.length > 0) {
    var s = nn.ensure();
    for (const c of i)
      s.schedule(c);
  }
  if (Ht = null, Yr = null, A(this, M, On).call(this)) {
    A(this, M, Pt).call(this, n), A(this, M, Pt).call(this, r);
    for (const [c, _] of a(this, je))
      Qi(c, _);
    i.length > 0 && /** @type {unknown} */
    A(f = y, M, fr).call(f);
    return;
  }
  const o = A(this, M, Wi).call(this);
  if (o) {
    A(this, M, Pt).call(this, n), A(this, M, Pt).call(this, r), A(u = o, M, Xi).call(u, this);
    return;
  }
  a(this, Ze).clear(), a(this, Ce).clear();
  for (const c of a(this, Vt)) c(this);
  a(this, Vt).clear(), hr = this, di(n), di(r), hr = null, (h = a(this, Ut)) == null || h.resolve();
  var l = (
    /** @type {Batch | null} */
    /** @type {unknown} */
    y
  );
  if (a(this, qt) === 0 && (a(this, fe).length === 0 || l !== null) && A(this, M, ur).call(this), a(this, fe).length > 0)
    if (l !== null) {
      const c = l;
      a(c, fe).push(...a(this, fe).filter((_) => !a(c, fe).includes(_)));
    } else
      l = this;
  l !== null && A(p = l, M, fr).call(p);
}, /**
 * Traverse the effect tree, executing effects or stashing
 * them for later execution as appropriate
 * @param {Effect} root
 * @param {Effect[]} effects
 * @param {Effect[]} render_effects
 */
Mn = function(t, r, n) {
  t.f ^= Y;
  for (var i = t.first; i !== null; ) {
    var s = i.f, o = (s & (Te | qe)) !== 0, l = o && (s & Y) !== 0, f = l || (s & ee) !== 0 || a(this, je).has(i);
    if (!f && i.fn !== null) {
      o ? i.f ^= Y : (s & Jt) !== 0 ? r.push(i) : Rr(i) && ((s & Ie) !== 0 && a(this, Ce).add(i), Qt(i));
      var u = i.first;
      if (u !== null) {
        i = u;
        continue;
      }
    }
    for (; i !== null; ) {
      var h = i.next;
      if (h !== null) {
        i = h;
        break;
      }
      i = i.parent;
    }
  }
}, Wi = function() {
  for (var t = a(this, ft); t !== null; ) {
    if (!t.is_fork) {
      for (const [r, [, n]] of this.current)
        if (t.current.has(r) && !n)
          return t;
    }
    t = a(t, ft);
  }
  return null;
}, /**
 * @param {Batch} batch
 */
Xi = function(t) {
  var n;
  for (const [i, s] of t.current)
    !this.previous.has(i) && t.previous.has(i) && this.previous.set(i, t.previous.get(i)), this.current.set(i, s);
  for (const [i, s] of t.async_deriveds) {
    const o = this.async_deriveds.get(i);
    o && s.promise.then(o.resolve).catch(o.reject);
  }
  t.async_deriveds.clear(), this.transfer_effects(a(t, Ze), a(t, Ce));
  const r = (i) => {
    var s = i.reactions;
    if (s !== null && !((i.f & U) !== 0 && (i.f & (j | De)) === 0))
      for (const f of s) {
        var o = f.f;
        if ((o & U) !== 0)
          r(
            /** @type {Derived} */
            f
          );
        else {
          var l = (
            /** @type {Effect} */
            f
          );
          o & (zt | Ie) && !this.async_deriveds.has(l) && (a(this, Ce).delete(l), H(l, j), this.schedule(l));
        }
      }
  };
  for (const i of this.current.keys())
    r(i);
  this.oncommit(() => t.discard()), A(n = t, M, ur).call(n), y = this, A(this, M, fr).call(this);
}, /**
 * @param {Effect[]} effects
 */
Pt = function(t) {
  for (var r = 0; r < t.length; r += 1)
    ji(t[r], a(this, Ze), a(this, Ce));
}, Ul = function() {
  var p;
  for (let c = _n; c !== null; c = a(c, yt)) {
    var t = c.id < this.id, r = [];
    for (const [_, [v, b]] of this.current) {
      if (c.current.has(_)) {
        var n = (
          /** @type {[any, boolean]} */
          c.current.get(_)[0]
        );
        if (t && v !== n)
          c.current.set(_, [v, b]);
        else
          continue;
      }
      r.push(_);
    }
    if (t)
      for (const [_, v] of this.async_deriveds) {
        const b = c.async_deriveds.get(_);
        b && v.promise.then(b.resolve).catch(b.reject);
      }
    var i = [...c.current.keys()].filter(
      (_) => !/** @type {[any, boolean]} */
      c.current.get(_)[1]
    );
    if (!(!a(c, Bt) || i.length === 0)) {
      var s = i.filter((_) => !this.current.has(_));
      if (s.length === 0)
        t && c.discard();
      else if (r.length > 0) {
        if (t)
          for (const _ of a(this, Gt))
            c.unskip_effect(_, (v) => {
              var b;
              (v.f & (Ie | zt)) !== 0 ? c.schedule(v) : A(b = c, M, Pt).call(b, [v]);
            });
        c.activate();
        var o = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Map();
        for (var f of r)
          Zi(f, s, o, l);
        l = /* @__PURE__ */ new Map();
        var u = [...c.current].filter(([_, v]) => {
          const b = this.current.get(_);
          return b ? b[0] !== v[0] || b[1] !== v[1] : !0;
        }).map(([_]) => _);
        if (u.length > 0)
          for (const _ of a(this, xr))
            (_.f & (_e | ee | Wr)) === 0 && Yn(_, u, l) && ((_.f & (zt | Ie)) !== 0 ? (H(_, j), c.schedule(_)) : a(c, Ze).add(_));
        if (a(c, fe).length > 0 && !a(c, $t)) {
          c.apply();
          for (var h of a(c, fe))
            A(p = c, M, Mn).call(p, h, [], []);
          $(c, fe, []);
        }
        c.deactivate();
      }
    }
  }
}, ur = function() {
  if (this.linked) {
    var t = a(this, ft), r = a(this, yt);
    t === null ? _n = r : $(t, yt, r), r === null ? It = t : $(r, ft, t), this.linked = !1;
  }
};
let ht = nn;
function Se(e) {
  var t = pr;
  pr = !0;
  try {
    for (var r; ; ) {
      if (Ol(), y === null)
        return (
          /** @type {T} */
          r
        );
      y.flush();
    }
  } finally {
    pr = t;
  }
}
function Gl() {
  try {
    yl();
  } catch (e) {
    ct(e, Cn);
  }
}
let Re = null;
function di(e) {
  var t = e.length;
  if (t !== 0) {
    for (var r = 0; r < t; ) {
      var n = e[r++];
      if ((n.f & (_e | ee)) === 0 && Rr(n) && (Re = /* @__PURE__ */ new Set(), Qt(n), n.deps === null && n.first === null && n.nodes === null && n.teardown === null && n.ac === null && hs(n), (Re == null ? void 0 : Re.size) > 0)) {
        St.clear();
        for (const i of Re) {
          if ((i.f & (_e | ee)) !== 0) continue;
          const s = [i];
          let o = i.parent;
          for (; o !== null; )
            Re.has(o) && (Re.delete(o), s.push(o)), o = o.parent;
          for (let l = s.length - 1; l >= 0; l--) {
            const f = s[l];
            (f.f & (_e | ee)) === 0 && Qt(f);
          }
        }
        Re.clear();
      }
    }
    Re = null;
  }
}
function Zi(e, t, r, n) {
  if (!r.has(e) && (r.add(e), e.reactions !== null))
    for (const i of e.reactions) {
      const s = i.f;
      (s & U) !== 0 ? Zi(
        /** @type {Derived} */
        i,
        t,
        r,
        n
      ) : (s & (zt | Ie)) !== 0 && (s & j) === 0 && Yn(i, t, n) && (H(i, j), qn(
        /** @type {Effect} */
        i
      ));
    }
}
function Yn(e, t, r) {
  const n = r.get(e);
  if (n !== void 0) return n;
  if (e.deps !== null)
    for (const i of e.deps) {
      if (Gr.call(t, i))
        return !0;
      if ((i.f & U) !== 0 && Yn(
        /** @type {Derived} */
        i,
        t,
        r
      ))
        return r.set(
          /** @type {Derived} */
          i,
          !0
        ), !0;
    }
  return r.set(e, !1), !1;
}
function qn(e) {
  y.schedule(e);
}
function Qi(e, t) {
  if (!((e.f & Te) !== 0 && (e.f & Y) !== 0)) {
    (e.f & j) !== 0 ? t.d.push(e) : (e.f & De) !== 0 && t.m.push(e), H(e, Y);
    for (var r = e.first; r !== null; )
      Qi(r, t), r = r.next;
  }
}
function es(e) {
  H(e, Y);
  for (var t = e.first; t !== null; )
    es(t), t = t.next;
}
let en = /* @__PURE__ */ new Set();
const St = /* @__PURE__ */ new Map();
let ts = !1;
function Rt(e, t) {
  var r = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: Li,
    rv: 0,
    wv: 0
  };
  return r;
}
// @__NO_SIDE_EFFECTS__
function W(e, t) {
  const r = Rt(e);
  return gs(r), r;
}
// @__NO_SIDE_EFFECTS__
function rs(e, t = !1, r = !0) {
  const n = Rt(e);
  return t || (n.equals = Di), n;
}
function O(e, t, r = !1) {
  N !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!Le || (N.f & Wr) !== 0) && Pi() && (N.f & (U | Ie | zt | Wr)) !== 0 && (Ye === null || !Ye.has(e)) && kl();
  let n = r ? dt(t) : t;
  return Zt(e, n, Yr);
}
function Zt(e, t, r = null) {
  if (!e.equals(t)) {
    St.set(e, nt ? t : e.v);
    var n = ht.ensure();
    if (n.capture(e, t), (e.f & U) !== 0) {
      const i = (
        /** @type {Derived} */
        e
      );
      (e.f & j) !== 0 && Vn(i), J === null && Bn(i);
    }
    e.wv = bs(), ns(e, j, r), k !== null && (k.f & Y) !== 0 && (k.f & (Te | qe)) === 0 && (me === null ? to([e]) : me.push(e)), !n.is_fork && en.size > 0 && !ts && Jl();
  }
  return t;
}
function Jl() {
  ts = !1;
  for (const e of en) {
    (e.f & Y) !== 0 && H(e, De);
    let t;
    try {
      t = Rr(e);
    } catch {
      t = !0;
    }
    t && Qt(e);
  }
  en.clear();
}
function _r(e) {
  O(e, e.v + 1);
}
function ns(e, t, r) {
  var n = e.reactions;
  if (n !== null)
    for (var i = n.length, s = 0; s < i; s++) {
      var o = n[s], l = o.f, f = (l & j) === 0;
      if (f && H(o, t), (l & Wr) !== 0)
        en.add(
          /** @type {Effect} */
          o
        );
      else if ((l & U) !== 0) {
        var u = (
          /** @type {Derived} */
          o
        );
        J == null || J.delete(u), (l & Nt) === 0 && (l & ke && (k === null || (k.f & Xr) === 0) && (o.f |= Nt), ns(u, De, r));
      } else if (f) {
        var h = (
          /** @type {Effect} */
          o
        );
        (l & Ie) !== 0 && Re !== null && Re.add(h), r !== null ? r.push(h) : qn(h);
      }
    }
}
function dt(e) {
  if (typeof e != "object" || e === null || dr in e)
    return e;
  const t = Ni(e);
  if (t !== fl && t !== ul)
    return e;
  var r = /* @__PURE__ */ new Map(), n = Ai(e), i = /* @__PURE__ */ W(0), s = Tt, o = (l) => {
    if (Tt === s)
      return l();
    var f = N, u = Tt;
    Ae(null), pi(s);
    var h = l();
    return Ae(f), pi(u), h;
  };
  return n && r.set("length", /* @__PURE__ */ W(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(l, f, u) {
        (!("value" in u) || u.configurable === !1 || u.enumerable === !1 || u.writable === !1) && El();
        var h = r.get(f);
        return h === void 0 ? o(() => {
          var p = /* @__PURE__ */ W(u.value);
          return r.set(f, p), p;
        }) : O(h, u.value, !0), !0;
      },
      deleteProperty(l, f) {
        var u = r.get(f);
        if (u === void 0) {
          if (f in l) {
            const h = o(() => /* @__PURE__ */ W(V));
            r.set(f, h), _r(i);
          }
        } else
          O(u, V), _r(i);
        return !0;
      },
      get(l, f, u) {
        var _;
        if (f === dr)
          return e;
        var h = r.get(f), p = f in l;
        if (h === void 0 && (!p || (_ = Et(l, f)) != null && _.writable) && (h = o(() => {
          var v = dt(p ? l[f] : V), b = /* @__PURE__ */ W(v);
          return b;
        }), r.set(f, h)), h !== void 0) {
          var c = g(h);
          return c === V ? void 0 : c;
        }
        return Reflect.get(l, f, u);
      },
      getOwnPropertyDescriptor(l, f) {
        var u = Reflect.getOwnPropertyDescriptor(l, f);
        if (u && "value" in u) {
          var h = r.get(f);
          h && (u.value = g(h));
        } else if (u === void 0) {
          var p = r.get(f), c = p == null ? void 0 : p.v;
          if (p !== void 0 && c !== V)
            return {
              enumerable: !0,
              configurable: !0,
              value: c,
              writable: !0
            };
        }
        return u;
      },
      has(l, f) {
        var c;
        if (f === dr)
          return !0;
        var u = r.get(f), h = u !== void 0 && u.v !== V || Reflect.has(l, f);
        if (u !== void 0 || k !== null && (!h || (c = Et(l, f)) != null && c.writable)) {
          u === void 0 && (u = o(() => {
            var _ = h ? dt(l[f]) : V, v = /* @__PURE__ */ W(_);
            return v;
          }), r.set(f, u));
          var p = g(u);
          if (p === V)
            return !1;
        }
        return h;
      },
      set(l, f, u, h) {
        var X;
        var p = r.get(f), c = f in l;
        if (n && f === "length")
          for (var _ = u; _ < /** @type {Source<number>} */
          p.v; _ += 1) {
            var v = r.get(_ + "");
            v !== void 0 ? O(v, V) : _ in l && (v = o(() => /* @__PURE__ */ W(V)), r.set(_ + "", v));
          }
        if (p === void 0)
          (!c || (X = Et(l, f)) != null && X.writable) && (p = o(() => /* @__PURE__ */ W(void 0)), O(p, dt(u)), r.set(f, p));
        else {
          c = p.v !== V;
          var b = o(() => dt(u));
          O(p, b);
        }
        var S = Reflect.getOwnPropertyDescriptor(l, f);
        if (S != null && S.set && S.set.call(h, u), !c) {
          if (n && typeof f == "string") {
            var x = (
              /** @type {Source<number>} */
              r.get("length")
            ), I = Number(f);
            Number.isInteger(I) && I >= x.v && O(x, I + 1);
          }
          _r(i);
        }
        return !0;
      },
      ownKeys(l) {
        g(i);
        var f = Reflect.ownKeys(l).filter((p) => {
          var c = r.get(p);
          return c === void 0 || c.v !== V;
        });
        for (var [u, h] of r)
          h.v !== V && !(u in l) && f.push(u);
        return f;
      },
      setPrototypeOf() {
        Sl();
      }
    }
  );
}
var vi, is, ss, ls;
function In() {
  if (vi === void 0) {
    vi = window, is = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, r = Text.prototype;
    ss = Et(t, "firstChild").get, ls = Et(t, "nextSibling").get, fi(e) && (e[Sn] = void 0, e[jr] = null, e[kn] = void 0, e.__e = void 0), fi(r) && (r[lr] = void 0);
  }
}
function Pe(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function Me(e) {
  return (
    /** @type {TemplateNode | null} */
    ss.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function Fe(e) {
  return (
    /** @type {TemplateNode | null} */
    ls.call(e)
  );
}
function oe(e, t) {
  if (!C)
    return /* @__PURE__ */ Me(e);
  var r = /* @__PURE__ */ Me(T);
  if (r === null)
    r = T.appendChild(Pe());
  else if (t && r.nodeType !== an) {
    var n = Pe();
    return r == null || r.before(n), ne(n), n;
  }
  return t && Un(
    /** @type {Text} */
    r
  ), ne(r), r;
}
function Lt(e, t = !1) {
  if (!C) {
    var r = /* @__PURE__ */ Me(e);
    return r instanceof Comment && r.data === "" ? /* @__PURE__ */ Fe(r) : r;
  }
  if (t) {
    if ((T == null ? void 0 : T.nodeType) !== an) {
      var n = Pe();
      return T == null || T.before(n), ne(n), n;
    }
    Un(
      /** @type {Text} */
      T
    );
  }
  return T;
}
function z(e, t = 1, r = !1) {
  let n = C ? T : e;
  for (var i; t--; )
    i = n, n = /** @type {TemplateNode} */
    /* @__PURE__ */ Fe(n);
  if (!C)
    return n;
  if (r) {
    if ((n == null ? void 0 : n.nodeType) !== an) {
      var s = Pe();
      return n === null ? i == null || i.after(s) : n.before(s), ne(s), s;
    }
    Un(
      /** @type {Text} */
      n
    );
  }
  return ne(n), n;
}
function os(e) {
  e.textContent = "";
}
function as() {
  return !1;
}
function fn(e, t, r) {
  return t == null || t === ki ? (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    r ? document.createElement(e, { is: r }) : document.createElement(e)
  ) : (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    r ? document.createElementNS(t, e, { is: r }) : document.createElementNS(t, e)
  );
}
function Un(e) {
  if (
    /** @type {string} */
    e.nodeValue.length < 65536
  )
    return;
  let t = e.nextSibling;
  for (; t !== null && t.nodeType === an; )
    t.remove(), e.nodeValue += /** @type {string} */
    t.nodeValue, t = e.nextSibling;
}
function Kl(e) {
  k === null && (N === null && ml(), bl()), nt && wl();
}
function Wl(e, t) {
  var r = t.last;
  r === null ? t.last = t.first = e : (r.next = e, e.prev = r, t.last = e);
}
function Ge(e, t) {
  var r = k;
  r !== null && (r.f & ee) !== 0 && (e |= ee);
  var n = {
    ctx: te,
    deps: null,
    nodes: null,
    f: e | j | ke,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: r,
    b: r && r.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  y == null || y.register_created_effect(n);
  var i = n;
  if ((e & Jt) !== 0)
    Ht !== null ? Ht.push(n) : ht.ensure().schedule(n);
  else if (t !== null) {
    try {
      Qt(n);
    } catch (o) {
      throw re(n), o;
    }
    i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && // either `null`, or a singular child
    (i.f & Ot) === 0 && (i = i.first, (e & Ie) !== 0 && (e & Kt) !== 0 && i !== null && (i.f |= Kt));
  }
  if (i !== null && (i.parent = r, r !== null && Wl(i, r), N !== null && (N.f & U) !== 0 && (e & qe) === 0)) {
    var s = (
      /** @type {Derived} */
      N
    );
    (s.effects ?? (s.effects = [])).push(i);
  }
  return n;
}
function Gn() {
  return N !== null && !Le;
}
function fs(e) {
  const t = Ge(on, null);
  return H(t, Y), t.teardown = e, t;
}
function Fr(e) {
  Kl();
  var t = (
    /** @type {Effect} */
    k.f
  ), r = !N && (t & Te) !== 0 && te !== null && !te.i;
  if (r) {
    var n = (
      /** @type {ComponentContext} */
      te
    );
    (n.e ?? (n.e = [])).push(e);
  } else
    return us(e);
}
function us(e) {
  return Ge(Jt | vl, e);
}
function Xl(e) {
  ht.ensure();
  const t = Ge(qe | Ot, e);
  return () => {
    re(t);
  };
}
function Zl(e) {
  ht.ensure();
  const t = Ge(qe | Ot, e);
  return (r = {}) => new Promise((n) => {
    r.outro ? kt(t, () => {
      re(t), n(void 0);
    }) : (re(t), n(void 0));
  });
}
function cs(e) {
  return Ge(Jt, e);
}
function Ql(e) {
  return Ge(zt | Ot, e);
}
function Nr(e, t = 0) {
  return Ge(on | t, e);
}
function Ft(e, t = [], r = [], n = []) {
  zl(n, t, r, (i) => {
    Ge(on, () => {
      e(...i.map(g));
    });
  });
}
function Jn(e, t = 0) {
  var r = Ge(Ie | t, e);
  return r;
}
function Ee(e) {
  return Ge(Te | Ot, e);
}
function ds(e) {
  var t = e.teardown;
  if (t !== null) {
    const r = nt, n = N;
    hi(!0), Ae(null);
    try {
      t.call(null);
    } finally {
      hi(r), Ae(n);
    }
  }
}
function Kn(e, t = !1) {
  var r = e.first;
  for (e.first = e.last = null; r !== null; ) {
    const i = r.ac;
    i !== null && Ar(() => {
      i.abort(kr);
    });
    var n = r.next;
    (r.f & qe) !== 0 ? r.parent = null : re(r, t), r = n;
  }
}
function eo(e) {
  for (var t = e.first; t !== null; ) {
    var r = t.next;
    (t.f & Te) === 0 && re(t), t = r;
  }
}
function re(e, t = !0) {
  var r = !1;
  (t || (e.f & dl) !== 0) && e.nodes !== null && e.nodes.end !== null && (vs(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), r = !0), e.f |= En, Kn(e, t && !r), br(e, 0);
  var n = e.nodes && e.nodes.t;
  if (n !== null)
    for (const s of n)
      s.stop();
  ds(e), e.f ^= En, e.f |= _e;
  var i = e.parent;
  i !== null && i.first !== null && hs(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function vs(e, t) {
  for (; e !== null; ) {
    var r = e === t ? null : /* @__PURE__ */ Fe(e);
    e.remove(), e = r;
  }
}
function hs(e) {
  var t = e.parent, r = e.prev, n = e.next;
  r !== null && (r.next = n), n !== null && (n.prev = r), t !== null && (t.first === e && (t.first = n), t.last === e && (t.last = r));
}
function kt(e, t, r = !0) {
  var n = [];
  ps(e, n, !0);
  var i = () => {
    r && re(e), t && t();
  }, s = n.length;
  if (s > 0) {
    var o = () => --s || i();
    for (var l of n)
      l.out(o);
  } else
    i();
}
function ps(e, t, r) {
  if ((e.f & ee) === 0) {
    e.f ^= ee;
    var n = e.nodes && e.nodes.t;
    if (n !== null)
      for (const l of n)
        (l.is_global || r) && t.push(l);
    for (var i = e.first; i !== null; ) {
      var s = i.next;
      if ((i.f & qe) === 0) {
        var o = (i.f & Kt) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (i.f & Te) !== 0 && (e.f & Ie) !== 0;
        ps(i, t, o ? r : !1);
      }
      i = s;
    }
  }
}
function tn(e) {
  _s(e, !0);
}
function _s(e, t) {
  if ((e.f & ee) !== 0) {
    e.f ^= ee, (e.f & Y) === 0 && (H(e, j), ht.ensure().schedule(e));
    for (var r = e.first; r !== null; ) {
      var n = r.next, i = (r.f & Kt) !== 0 || (r.f & Te) !== 0;
      _s(r, i ? t : !1), r = n;
    }
    var s = e.nodes && e.nodes.t;
    if (s !== null)
      for (const o of s)
        (o.is_global || t) && o.in();
  }
}
function Wn(e, t) {
  if (e.nodes)
    for (var r = e.nodes.start, n = e.nodes.end; r !== null; ) {
      var i = r === n ? null : /* @__PURE__ */ Fe(r);
      t.append(r), r = i;
    }
}
let qr = !1, nt = !1;
function hi(e) {
  nt = e;
}
let N = null, Le = !1;
function Ae(e) {
  N = e;
}
let k = null;
function Ue(e) {
  k = e;
}
let Ye = null;
function gs(e) {
  N !== null && (Ye ?? (Ye = /* @__PURE__ */ new Set())).add(e);
}
let ue = null, de = 0, me = null;
function to(e) {
  me = e;
}
let ws = 1, gt = 0, Tt = gt;
function pi(e) {
  Tt = e;
}
function bs() {
  return ++ws;
}
function Rr(e) {
  var t = e.f;
  if ((t & j) !== 0)
    return !0;
  if (t & U && (e.f &= ~Nt), (t & De) !== 0) {
    for (var r = (
      /** @type {Value[]} */
      e.deps
    ), n = r.length, i = 0; i < n; i++) {
      var s = r[i];
      if (Rr(
        /** @type {Derived} */
        s
      ) && Ji(
        /** @type {Derived} */
        s
      ), s.wv > e.wv)
        return !0;
    }
    (t & ke) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    J === null && H(e, Y);
  }
  return !1;
}
function ms(e, t, r = !0) {
  var n = e.reactions;
  if (n !== null && !(Ye !== null && Ye.has(e)))
    for (var i = 0; i < n.length; i++) {
      var s = n[i];
      (s.f & U) !== 0 ? ms(
        /** @type {Derived} */
        s,
        t,
        !1
      ) : t === s && (r ? H(s, j) : (s.f & Y) !== 0 && H(s, De), qn(
        /** @type {Effect} */
        s
      ));
    }
}
function ys(e) {
  var b;
  var t = ue, r = de, n = me, i = N, s = Ye, o = te, l = Le, f = Tt, u = e.f;
  ue = /** @type {null | Value[]} */
  null, de = 0, me = null, N = (u & (Te | qe)) === 0 ? e : null, Ye = null, Xt(e.ctx), Le = !1, Tt = ++gt, e.ac !== null && (Ar(() => {
    e.ac.abort(kr);
  }), e.ac = null);
  try {
    e.f |= Xr;
    var h = (
      /** @type {Function} */
      e.fn
    ), p = h();
    e.f |= Ct;
    var c = e.deps, _ = y == null ? void 0 : y.is_fork;
    if (ue !== null) {
      var v;
      if (_ || br(e, de), c !== null && de > 0)
        for (c.length = de + ue.length, v = 0; v < ue.length; v++)
          c[de + v] = ue[v];
      else
        e.deps = c = ue;
      if (Gn() && (e.f & ke) !== 0)
        for (v = de; v < c.length; v++)
          ((b = c[v]).reactions ?? (b.reactions = [])).push(e);
    } else !_ && c !== null && de < c.length && (br(e, de), c.length = de);
    if (Pi() && me !== null && !Le && c !== null && (e.f & (U | De | j)) === 0)
      for (v = 0; v < /** @type {Source[]} */
      me.length; v++)
        ms(
          me[v],
          /** @type {Effect} */
          e
        );
    if (i !== null && i !== e) {
      if (gt++, i.deps !== null)
        for (let S = 0; S < r; S += 1)
          i.deps[S].rv = gt;
      if (t !== null)
        for (const S of t)
          S.rv = gt;
      me !== null && (n === null ? n = me : n.push(.../** @type {Source[]} */
      me));
    }
    return (e.f & vt) !== 0 && (e.f ^= vt), p;
  } catch (S) {
    return Hi(S);
  } finally {
    e.f ^= Xr, ue = t, de = r, me = n, N = i, Ye = s, Xt(o), Le = l, Tt = f;
  }
}
function ro(e, t) {
  let r = t.reactions;
  if (r !== null) {
    var n = ol.call(r, e);
    if (n !== -1) {
      var i = r.length - 1;
      i === 0 ? r = t.reactions = null : (r[n] = r[i], r.pop());
    }
  }
  if (r === null && (t.f & U) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (ue === null || !Gr.call(ue, t))) {
    var s = (
      /** @type {Derived} */
      t
    );
    (s.f & ke) !== 0 && (s.f ^= ke, s.f &= ~Nt), s.v !== V && Bn(s), s.ac !== null && Ar(() => {
      s.ac.abort(kr), s.ac = null, H(s, j);
    }), Yl(s), br(s, 0);
  }
}
function br(e, t) {
  var r = e.deps;
  if (r !== null)
    for (var n = t; n < r.length; n++)
      ro(e, r[n]);
}
function Qt(e) {
  var t = e.f;
  if ((t & _e) === 0) {
    H(e, Y);
    var r = k, n = qr;
    k = e, qr = (t & (Te | qe)) === 0;
    try {
      (t & (Ie | Oi)) !== 0 ? eo(e) : Kn(e), ds(e);
      var i = ys(e);
      e.teardown = typeof i == "function" ? i : null, e.wv = ws;
      var s;
      Ti && Cl && (e.f & j) !== 0 && e.deps;
    } finally {
      qr = n, k = r;
    }
  }
}
async function no() {
  await Promise.resolve(), Se();
}
function g(e) {
  var t = e.f, r = (t & U) !== 0;
  if (N !== null && !Le) {
    var n = k !== null && (k.f & _e) !== 0;
    if (!n && (Ye === null || !Ye.has(e))) {
      var i = N.deps;
      if ((N.f & Xr) !== 0)
        e.rv < gt && (e.rv = gt, ue === null && i !== null && i[de] === e ? de++ : ue === null ? ue = [e] : ue.push(e));
      else {
        N.deps ?? (N.deps = []), Gr.call(N.deps, e) || N.deps.push(e);
        var s = e.reactions;
        s === null ? e.reactions = [N] : Gr.call(s, N) || s.push(N);
      }
    }
  }
  if (nt && St.has(e))
    return St.get(e);
  if (r) {
    var o = (
      /** @type {Derived} */
      e
    );
    if (nt) {
      var l = o.v;
      return ((o.f & Y) === 0 && o.reactions !== null || xs(o)) && (l = Vn(o)), St.set(o, l), l;
    }
    var f = (o.f & ke) === 0 && !Le && N !== null && (qr || (N.f & ke) !== 0), u = (o.f & Ct) === 0;
    Rr(o) && (f && (o.f |= ke), Ji(o)), f && !u && (Ki(o), $s(o));
  }
  if (J != null && J.has(e))
    return J.get(e);
  if ((e.f & vt) !== 0)
    throw e.v;
  return e.v;
}
function $s(e) {
  if (e.f |= ke, e.deps !== null)
    for (const t of e.deps)
      (t.reactions ?? (t.reactions = [])).push(e), (t.f & U) !== 0 && (t.f & ke) === 0 && (Ki(
        /** @type {Derived} */
        t
      ), $s(
        /** @type {Derived} */
        t
      ));
}
function xs(e) {
  if (e.v === V) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (St.has(t) || (t.f & U) !== 0 && xs(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function un(e) {
  var t = Le;
  try {
    return Le = !0, e();
  } finally {
    Le = t;
  }
}
const wt = Symbol("events"), Es = /* @__PURE__ */ new Set(), Ln = /* @__PURE__ */ new Set();
function ze(e, t, r) {
  (t[wt] ?? (t[wt] = {}))[e] = r;
}
function io(e) {
  for (var t = 0; t < e.length; t++)
    Es.add(e[t]);
  for (var r of Ln)
    r(e);
}
let _i = null;
function gi(e) {
  var b, S;
  var t = this, r = (
    /** @type {Node} */
    t.ownerDocument
  ), n = e.type, i = ((b = e.composedPath) == null ? void 0 : b.call(e)) || [], s = (
    /** @type {null | Element} */
    i[0] || e.target
  );
  _i = e;
  var o = 0, l = _i === e && e[wt];
  if (l) {
    var f = i.indexOf(l);
    if (f !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e[wt] = t;
      return;
    }
    var u = i.indexOf(t);
    if (u === -1)
      return;
    f <= u && (o = f);
  }
  if (s = /** @type {Element} */
  i[o] || e.target, s !== t) {
    Kr(e, "currentTarget", {
      configurable: !0,
      get() {
        return s || r;
      }
    });
    var h = N, p = k;
    Ae(null), Ue(null);
    try {
      for (var c, _ = []; s !== null && s !== t; ) {
        try {
          var v = (S = s[wt]) == null ? void 0 : S[n];
          v != null && (!/** @type {any} */
          s.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === s) && v.call(s, e);
        } catch (x) {
          c ? _.push(x) : c = x;
        }
        if (e.cancelBubble) break;
        o++, s = o < i.length ? (
          /** @type {Element} */
          i[o]
        ) : null;
      }
      if (c) {
        for (let x of _)
          queueMicrotask(() => {
            throw x;
          });
        throw c;
      }
    } finally {
      e[wt] = t, delete e.currentTarget, Ae(h), Ue(p);
    }
  }
}
var Ei;
const wn = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  ((Ei = globalThis == null ? void 0 : globalThis.window) == null ? void 0 : Ei.trustedTypes) && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (e) => e
  })
);
function so(e) {
  return (
    /** @type {string} */
    (wn == null ? void 0 : wn.createHTML(e)) ?? e
  );
}
function lo(e) {
  var t = fn("template");
  return t.innerHTML = so(e.replaceAll("<!>", "<!---->")), t.content;
}
function rt(e, t) {
  var r = (
    /** @type {Effect} */
    k
  );
  r.nodes === null && (r.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function ie(e, t) {
  var r = (t & nl) !== 0, n = (t & il) !== 0, i, s = !e.startsWith("<!>");
  return () => {
    if (C)
      return rt(T, null), T;
    i === void 0 && (i = lo(s ? e : "<!>" + e), r || (i = /** @type {TemplateNode} */
    /* @__PURE__ */ Me(i)));
    var o = (
      /** @type {TemplateNode} */
      n || is ? document.importNode(i, !0) : i.cloneNode(!0)
    );
    if (r) {
      var l = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Me(o)
      ), f = (
        /** @type {TemplateNode} */
        o.lastChild
      );
      rt(l, f);
    } else
      rt(o, o);
    return o;
  };
}
function oo() {
  if (C)
    return rt(T, null), T;
  var e = document.createDocumentFragment(), t = document.createComment(""), r = Pe();
  return e.append(t, r), rt(t, r), e;
}
function G(e, t) {
  if (C) {
    var r = (
      /** @type {Effect & { nodes: EffectNodes }} */
      k
    );
    ((r.f & Ct) === 0 || r.nodes.end === null) && (r.nodes.end = T), Wt();
    return;
  }
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
const ao = ["touchstart", "touchmove"];
function fo(e) {
  return ao.includes(e);
}
function Hr(e, t) {
  var r = t == null ? "" : typeof t == "object" ? `${t}` : t;
  r !== /** @type {any} */
  (e[lr] ?? (e[lr] = e.nodeValue)) && (e[lr] = r, e.nodeValue = `${r}`);
}
function Ss(e, t) {
  return ks(e, t);
}
function uo(e, t) {
  In(), t.intro = t.intro ?? !1;
  const r = t.target, n = C, i = T;
  try {
    for (var s = /* @__PURE__ */ Me(r); s && (s.nodeType !== er || /** @type {Comment} */
    s.data !== Si); )
      s = /* @__PURE__ */ Fe(s);
    if (!s)
      throw At;
    tt(!0), ne(
      /** @type {Comment} */
      s
    );
    const o = ks(e, { ...t, anchor: s });
    return tt(!1), /**  @type {Exports} */
    o;
  } catch (o) {
    if (o instanceof Error && o.message.split(`
`).some((l) => l.startsWith("https://svelte.dev/e/")))
      throw o;
    return o !== At && console.warn("Failed to hydrate: ", o), t.recover === !1 && $l(), In(), os(r), tt(!1), Ss(e, t);
  } finally {
    tt(n), ne(i);
  }
}
const zr = /* @__PURE__ */ new Map();
function ks(e, { target: t, anchor: r, props: n = {}, events: i, context: s, intro: o = !0, transformError: l }) {
  In();
  var f = void 0, u = Zl(() => {
    var h = r ?? t.appendChild(Pe());
    Fl(
      /** @type {TemplateNode} */
      h,
      {
        pending: () => {
        }
      },
      (_) => {
        zn({});
        var v = (
          /** @type {ComponentContext} */
          te
        );
        if (s && (v.c = s), i && (n.$$events = i), C && rt(
          /** @type {TemplateNode} */
          _,
          null
        ), f = e(_, n) || {}, C && (k.nodes.end = T, T === null || T.nodeType !== er || /** @type {Comment} */
        T.data !== Hn))
          throw Tr(), At;
        jn();
      },
      l
    );
    var p = /* @__PURE__ */ new Set(), c = (_) => {
      for (var v = 0; v < _.length; v++) {
        var b = _[v];
        if (!p.has(b)) {
          p.add(b);
          var S = fo(b);
          for (const X of [t, document]) {
            var x = zr.get(X);
            x === void 0 && (x = /* @__PURE__ */ new Map(), zr.set(X, x));
            var I = x.get(b);
            I === void 0 ? (X.addEventListener(b, gi, { passive: S }), x.set(b, 1)) : x.set(b, I + 1);
          }
        }
      }
    };
    return c(ln(Es)), Ln.add(c), () => {
      var S;
      for (var _ of p)
        for (const x of [t, document]) {
          var v = (
            /** @type {Map<string, number>} */
            zr.get(x)
          ), b = (
            /** @type {number} */
            v.get(_)
          );
          --b == 0 ? (x.removeEventListener(_, gi), v.delete(_), v.size === 0 && zr.delete(x)) : v.set(_, b);
        }
      Ln.delete(c), h !== r && ((S = h.parentNode) == null || S.removeChild(h));
    };
  });
  return Dn.set(f, u), f;
}
let Dn = /* @__PURE__ */ new WeakMap();
function co(e, t) {
  const r = Dn.get(e);
  return r ? (Dn.delete(e), r(t)) : Promise.resolve();
}
var Oe, Be, pe, xt, Er, Sr, sn;
class vo {
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(t, r = !0) {
    /** @type {TemplateNode} */
    P(this, "anchor");
    /** @type {Map<Batch, Key>} */
    E(this, Oe, /* @__PURE__ */ new Map());
    /**
     * Map of keys to effects that are currently rendered in the DOM.
     * These effects are visible and actively part of the document tree.
     * Example:
     * ```
     * {#if condition}
     * 	foo
     * {:else}
     * 	bar
     * {/if}
     * ```
     * Can result in the entries `true->Effect` and `false->Effect`
     * @type {Map<Key, Effect>}
     */
    E(this, Be, /* @__PURE__ */ new Map());
    /**
     * Similar to #onscreen with respect to the keys, but contains branches that are not yet
     * in the DOM, because their insertion is deferred.
     * @type {Map<Key, Branch>}
     */
    E(this, pe, /* @__PURE__ */ new Map());
    /**
     * Keys of effects that are currently outroing
     * @type {Set<Key>}
     */
    E(this, xt, /* @__PURE__ */ new Set());
    /**
     * Whether to pause (i.e. outro) on change, or destroy immediately.
     * This is necessary for `<svelte:element>`
     */
    E(this, Er, !0);
    /**
     * @param {Batch} batch
     */
    E(this, Sr, (t) => {
      if (a(this, Oe).has(t)) {
        var r = (
          /** @type {Key} */
          a(this, Oe).get(t)
        ), n = a(this, Be).get(r);
        if (n)
          tn(n), a(this, xt).delete(r);
        else {
          var i = a(this, pe).get(r);
          i && (tn(i.effect), a(this, Be).set(r, i.effect), a(this, pe).delete(r), i.fragment.lastChild.remove(), this.anchor.before(i.fragment), n = i.effect);
        }
        for (const [s, o] of a(this, Oe)) {
          if (a(this, Oe).delete(s), s === t)
            break;
          const l = a(this, pe).get(o);
          l && (re(l.effect), a(this, pe).delete(o));
        }
        for (const [s, o] of a(this, Be)) {
          if (s === r || a(this, xt).has(s)) continue;
          const l = () => {
            if (Array.from(a(this, Oe).values()).includes(s)) {
              var u = document.createDocumentFragment();
              Wn(o, u), u.append(Pe()), a(this, pe).set(s, { effect: o, fragment: u });
            } else
              re(o);
            a(this, xt).delete(s), a(this, Be).delete(s);
          };
          a(this, Er) || !n ? (a(this, xt).add(s), kt(o, l, !1)) : l();
        }
      }
    });
    /**
     * @param {Batch} batch
     */
    E(this, sn, (t) => {
      a(this, Oe).delete(t);
      const r = Array.from(a(this, Oe).values());
      for (const [n, i] of a(this, pe))
        r.includes(n) || (re(i.effect), a(this, pe).delete(n));
    });
    this.anchor = t, $(this, Er, r);
  }
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(t, r) {
    var n = (
      /** @type {Batch} */
      y
    ), i = as();
    if (r && !a(this, Be).has(t) && !a(this, pe).has(t))
      if (i) {
        var s = document.createDocumentFragment(), o = Pe();
        s.append(o), a(this, pe).set(t, {
          effect: Ee(() => r(o)),
          fragment: s
        });
      } else
        a(this, Be).set(
          t,
          Ee(() => r(this.anchor))
        );
    if (a(this, Oe).set(n, t), i) {
      for (const [l, f] of a(this, Be))
        l === t ? n.unskip_effect(f) : n.skip_effect(f);
      for (const [l, f] of a(this, pe))
        l === t ? n.unskip_effect(f.effect) : n.skip_effect(f.effect);
      n.oncommit(a(this, Sr)), n.ondiscard(a(this, sn));
    } else
      C && (this.anchor = T), a(this, Sr).call(this, n);
  }
}
Oe = new WeakMap(), Be = new WeakMap(), pe = new WeakMap(), xt = new WeakMap(), Er = new WeakMap(), Sr = new WeakMap(), sn = new WeakMap();
function be(e, t, r = !1) {
  var n;
  C && (n = T, Wt());
  var i = new vo(e), s = r ? Kt : 0;
  function o(l, f) {
    if (C) {
      var u = Ii(
        /** @type {TemplateNode} */
        n
      );
      if (l !== parseInt(u.substring(1))) {
        var h = Zr();
        ne(h), i.anchor = h, tt(!1), i.ensure(l, f), tt(!0);
        return;
      }
    }
    i.ensure(l, f);
  }
  Jn(() => {
    var l = !1;
    t((f, u = 0) => {
      l = !0, o(u, f);
    }), l || o(-1, null);
  }, s);
}
function ho(e, t, r) {
  for (var n = [], i = t.length, s, o = t.length, l = 0; l < i; l++) {
    let p = t[l];
    kt(
      p,
      () => {
        if (s) {
          if (s.pending.delete(p), s.done.add(p), s.pending.size === 0) {
            var c = (
              /** @type {Set<EachOutroGroup>} */
              e.outrogroups
            );
            Pn(e, ln(s.done)), c.delete(s), c.size === 0 && (e.outrogroups = null);
          }
        } else
          o -= 1;
      },
      !1
    );
  }
  if (o === 0) {
    var f = n.length === 0 && r !== null;
    if (f) {
      var u = (
        /** @type {Element} */
        r
      ), h = (
        /** @type {Element} */
        u.parentNode
      );
      os(h), h.append(u), e.items.clear();
    }
    Pn(e, t, !f);
  } else
    s = {
      pending: new Set(t),
      done: /* @__PURE__ */ new Set()
    }, (e.outrogroups ?? (e.outrogroups = /* @__PURE__ */ new Set())).add(s);
}
function Pn(e, t, r = !0) {
  var n;
  if (e.pending.size > 0) {
    n = /* @__PURE__ */ new Set();
    for (const o of e.pending.values())
      for (const l of o)
        n.add(
          /** @type {EachItem} */
          e.items.get(l).e
        );
  }
  for (var i = 0; i < t.length; i++) {
    var s = t[i];
    if (n != null && n.has(s)) {
      s.f |= et;
      const o = document.createDocumentFragment();
      Wn(s, o);
    } else
      re(t[i], r);
  }
}
var wi;
function Dt(e, t, r, n, i, s = null) {
  var o = e, l = /* @__PURE__ */ new Map();
  C && Wt();
  var f = null, u = /* @__PURE__ */ Gi(() => {
    var x = r();
    return (
      /** @type {V[]} */
      Ai(x) ? x : x == null ? [] : ln(x)
    );
  }), h, p = /* @__PURE__ */ new Map(), c = !0;
  function _(x) {
    (S.effect.f & _e) === 0 && (S.pending.delete(x), S.fallback = f, po(S, h, o, t, n), f !== null && (h.length === 0 ? (f.f & et) === 0 ? tn(f) : (f.f ^= et, cr(f, null, o)) : kt(f, () => {
      f = null;
    })));
  }
  function v(x) {
    S.pending.delete(x);
  }
  var b = Jn(() => {
    h = /** @type {V[]} */
    g(u);
    var x = h.length;
    let I = !1;
    if (C) {
      var X = Ii(o) === Fn;
      X !== (x === 0) && (o = Zr(), ne(o), tt(!1), I = !0);
    }
    for (var K = /* @__PURE__ */ new Set(), D = (
      /** @type {Batch} */
      y
    ), Ne = as(), se = 0; se < x; se += 1) {
      C && T.nodeType === er && /** @type {Comment} */
      T.data === Hn && (o = /** @type {Comment} */
      T, I = !0, tt(!1));
      var ge = h[se], q = n(ge, se), we = c ? null : l.get(q);
      we ? (we.v && Zt(we.v, ge), we.i && Zt(we.i, se), Ne && D.unskip_effect(we.e)) : (we = _o(
        l,
        c ? o : wi ?? (wi = Pe()),
        ge,
        q,
        se,
        i,
        t,
        r
      ), c || (we.e.f |= et), l.set(q, we)), K.add(q);
    }
    if (x === 0 && s && !f && (c ? f = Ee(() => s(o)) : (f = Ee(() => s(wi ?? (wi = Pe()))), f.f |= et)), x > K.size && gl(), C && x > 0 && ne(Zr()), !c)
      if (p.set(D, K), Ne) {
        for (const [tr, Cr] of l)
          K.has(tr) || D.skip_effect(Cr.e);
        D.oncommit(_), D.ondiscard(v);
      } else
        _(D);
    I && tt(!0), g(u);
  }), S = { effect: b, items: l, pending: p, outrogroups: null, fallback: f };
  c = !1, C && (o = T);
}
function sr(e) {
  for (; e !== null && (e.f & Te) === 0; )
    e = e.next;
  return e;
}
function po(e, t, r, n, i) {
  var ge;
  var s = t.length, o = e.items, l = sr(e.effect.first), f, u = null, h = [], p = [], c, _, v, b;
  for (b = 0; b < s; b += 1) {
    if (c = t[b], _ = i(c, b), v = /** @type {EachItem} */
    o.get(_).e, e.outrogroups !== null)
      for (const q of e.outrogroups)
        q.pending.delete(v), q.done.delete(v);
    if ((v.f & ee) !== 0 && tn(v), (v.f & et) !== 0)
      if (v.f ^= et, v === l)
        cr(v, null, r);
      else {
        var S = u ? u.next : l;
        v === e.effect.last && (e.effect.last = v.prev), v.prev && (v.prev.next = v.next), v.next && (v.next.prev = v.prev), ot(e, u, v), ot(e, v, S), cr(v, S, r), u = v, h = [], p = [], l = sr(u.next);
        continue;
      }
    if (v !== l) {
      if (f !== void 0 && f.has(v)) {
        if (h.length < p.length) {
          var x = p[0], I;
          u = x.prev;
          var X = h[0], K = h[h.length - 1];
          for (I = 0; I < h.length; I += 1)
            cr(h[I], x, r);
          for (I = 0; I < p.length; I += 1)
            f.delete(p[I]);
          ot(e, X.prev, K.next), ot(e, u, X), ot(e, K, x), l = x, u = K, b -= 1, h = [], p = [];
        } else
          f.delete(v), cr(v, l, r), ot(e, v.prev, v.next), ot(e, v, u === null ? e.effect.first : u.next), ot(e, u, v), u = v;
        continue;
      }
      for (h = [], p = []; l !== null && l !== v; )
        (f ?? (f = /* @__PURE__ */ new Set())).add(l), p.push(l), l = sr(l.next);
      if (l === null)
        continue;
    }
    (v.f & et) === 0 && h.push(v), u = v, l = sr(v.next);
  }
  if (e.outrogroups !== null) {
    for (const q of e.outrogroups)
      q.pending.size === 0 && (Pn(e, ln(q.done)), (ge = e.outrogroups) == null || ge.delete(q));
    e.outrogroups.size === 0 && (e.outrogroups = null);
  }
  if (l !== null || f !== void 0) {
    var D = [];
    if (f !== void 0)
      for (v of f)
        (v.f & ee) === 0 && D.push(v);
    for (; l !== null; )
      (l.f & ee) === 0 && l !== e.fallback && D.push(l), l = sr(l.next);
    var Ne = D.length;
    if (Ne > 0) {
      var se = null;
      ho(e, D, se);
    }
  }
}
function _o(e, t, r, n, i, s, o, l) {
  var f = (o & Ws) !== 0 ? (o & Zs) === 0 ? /* @__PURE__ */ rs(r, !1, !1) : Rt(r) : null, u = (o & Xs) !== 0 ? Rt(i) : null;
  return {
    v: f,
    i: u,
    e: Ee(() => (s(t, f ?? r, u ?? i, l), () => {
      e.delete(n);
    }))
  };
}
function cr(e, t, r) {
  if (e.nodes)
    for (var n = e.nodes.start, i = e.nodes.end, s = t && (t.f & et) === 0 ? (
      /** @type {EffectNodes} */
      t.nodes.start
    ) : r; n !== null; ) {
      var o = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Fe(n)
      );
      if (s.before(n), n === i)
        return;
      n = o;
    }
}
function ot(e, t, r) {
  t === null ? e.effect.first = r : t.next = r, r === null ? e.effect.last = t : r.prev = t;
}
function go(e, t, r = !1, n = !1, i = !1, s = !1) {
  var o = e, l = "";
  if (r) {
    var f = (
      /** @type {Element} */
      e
    );
    C && (o = ne(/* @__PURE__ */ Me(f)));
  }
  Ft(() => {
    var u = (
      /** @type {Effect} */
      k
    );
    if (l === (l = t() ?? "")) {
      C && Wt();
      return;
    }
    if (r && !C) {
      u.nodes = null, f.innerHTML = /** @type {string} */
      l, l !== "" && rt(
        /** @type {TemplateNode} */
        /* @__PURE__ */ Me(f),
        /** @type {TemplateNode} */
        f.lastChild
      );
      return;
    }
    if (u.nodes !== null && (vs(
      u.nodes.start,
      /** @type {TemplateNode} */
      u.nodes.end
    ), u.nodes = null), l !== "") {
      if (C) {
        T.data;
        for (var h = Wt(), p = h; h !== null && (h.nodeType !== er || /** @type {Comment} */
        h.data !== ""); )
          p = h, h = /* @__PURE__ */ Fe(h);
        if (h === null)
          throw Tr(), At;
        rt(T, p), o = ne(h);
        return;
      }
      var c = n ? sl : i ? ll : void 0, _ = (
        /** @type {HTMLTemplateElement | SVGElement | MathMLElement} */
        fn(n ? "svg" : i ? "math" : "template", c)
      );
      _.innerHTML = /** @type {any} */
      l;
      var v = n || i ? _ : (
        /** @type {HTMLTemplateElement} */
        _.content
      );
      if (rt(
        /** @type {TemplateNode} */
        /* @__PURE__ */ Me(v),
        /** @type {TemplateNode} */
        v.lastChild
      ), n || i)
        for (; /* @__PURE__ */ Me(v); )
          o.before(
            /** @type {TemplateNode} */
            /* @__PURE__ */ Me(v)
          );
      else
        o.before(v);
    }
  });
}
function wo(e, t) {
  cs(() => {
    var r = e.getRootNode(), n = (
      /** @type {ShadowRoot} */
      r.host ? (
        /** @type {ShadowRoot} */
        r
      ) : (
        /** @type {Document} */
        r.head ?? /** @type {Document} */
        r.ownerDocument.head
      )
    );
    if (!n.querySelector("#" + t.hash)) {
      const i = fn("style");
      i.id = t.hash, i.textContent = t.code, n.appendChild(i);
    }
  });
}
const bi = [...` 	
\r\f \v\uFEFF`];
function bo(e, t, r) {
  var n = e == null ? "" : "" + e;
  if (r) {
    for (var i of Object.keys(r))
      if (r[i])
        n = n ? n + " " + i : i;
      else if (n.length)
        for (var s = i.length, o = 0; (o = n.indexOf(i, o)) >= 0; ) {
          var l = o + s;
          (o === 0 || bi.includes(n[o - 1])) && (l === n.length || bi.includes(n[l])) ? n = (o === 0 ? "" : n.substring(0, o)) + n.substring(l + 1) : o = l;
        }
  }
  return n === "" ? null : n;
}
function mo(e, t) {
  return e == null ? null : String(e);
}
function bn(e, t, r, n, i, s) {
  var o = (
    /** @type {any} */
    e[Sn]
  );
  if (C || o !== r || o === void 0) {
    var l = bo(r, n, s);
    (!C || l !== e.getAttribute("class")) && (l == null ? e.removeAttribute("class") : e.className = l), e[Sn] = r;
  } else if (s && i !== s)
    for (var f in s) {
      var u = !!s[f];
      (i == null || u !== !!i[f]) && e.classList.toggle(f, u);
    }
  return s;
}
function mi(e, t, r, n) {
  var i = (
    /** @type {any} */
    e[kn]
  );
  if (C || i !== t) {
    var s = mo(t);
    (!C || s !== e.getAttribute("style")) && (s == null ? e.removeAttribute("style") : e.style.cssText = s), e[kn] = t;
  }
  return n;
}
const yo = Symbol("is custom element"), $o = Symbol("is html"), xo = pl ? "link" : "LINK";
function Eo(e) {
  if (C) {
    var t = !1, r = () => {
      if (!t) {
        if (t = !0, e.hasAttribute("value")) {
          var n = e.value;
          gr(e, "value", null), e.value = n;
        }
        if (e.hasAttribute("checked")) {
          var i = e.checked;
          gr(e, "checked", null), e.checked = i;
        }
      }
    };
    e[vr] = r, ut(r), Bi();
  }
}
function gr(e, t, r, n) {
  var i = So(e);
  C && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === xo) || i[t] !== (i[t] = r) && (t === "loading" && (e[hl] = r), r == null ? e.removeAttribute(t) : typeof r != "string" && ko(e).includes(t) ? e[t] = r : e.setAttribute(t, r));
}
function So(e) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    /** @type {any} */
    e[jr] ?? (e[jr] = {
      [yo]: e.nodeName.includes("-"),
      [$o]: e.namespaceURI === ki
    })
  );
}
var yi = /* @__PURE__ */ new Map();
function ko(e) {
  var t = e.getAttribute("is") || e.nodeName, r = yi.get(t);
  if (r) return r;
  yi.set(t, r = []);
  for (var n, i = e, s = Element.prototype; s !== i; ) {
    n = al(i);
    for (var o in n)
      n[o].set && // better safe than sorry, we don't want spread attributes to mess with HTML content
      o !== "innerHTML" && o !== "textContent" && o !== "innerText" && r.push(o);
    i = Ni(i);
  }
  return r;
}
function To(e, t, r = t) {
  var n = /* @__PURE__ */ new WeakSet();
  Ll(e, "input", async (i) => {
    var s = i ? e.defaultValue : e.value;
    if (s = mn(e) ? yn(s) : s, r(s), y !== null && n.add(y), await no(), s !== (s = t())) {
      var o = e.selectionStart, l = e.selectionEnd, f = e.value.length;
      if (e.value = s ?? "", l !== null) {
        var u = e.value.length;
        o === l && l === f && u > f ? (e.selectionStart = u, e.selectionEnd = u) : (e.selectionStart = o, e.selectionEnd = Math.min(l, u));
      }
    }
  }), // If we are hydrating and the value has since changed,
  // then use the updated value from the input instead.
  (C && e.defaultValue !== e.value || // If defaultValue is set, then value == defaultValue
  // TODO Svelte 6: remove input.value check and set to empty string?
  un(t) == null && e.value) && (r(mn(e) ? yn(e.value) : e.value), y !== null && n.add(y)), Nr(() => {
    var i = t();
    if (e === document.activeElement) {
      var s = (
        /** @type {Batch} */
        y
      );
      if (n.has(s))
        return;
    }
    mn(e) && i === yn(e.value) || e.type === "date" && !i && !e.value || i !== e.value && (e.value = i ?? "");
  });
}
function mn(e) {
  var t = e.type;
  return t === "number" || t === "range";
}
function yn(e) {
  return e === "" ? null : +e;
}
function $n(e, t) {
  return e === t || (e == null ? void 0 : e[dr]) === t;
}
function Ts(e = {}, t, r, n) {
  var i = (
    /** @type {ComponentContext} */
    te.r
  ), s = (
    /** @type {Effect} */
    k
  );
  return cs(() => {
    var o, l;
    return Nr(() => {
      o = l, l = [], un(() => {
        $n(r(...l), e) || (t(e, ...l), o && $n(r(...o), e) && t(null, ...o));
      });
    }), () => {
      let f = s;
      for (; f !== i && f.parent !== null && f.parent.f & En; )
        f = f.parent;
      const u = () => {
        l && $n(r(...l), e) && t(null, ...l);
      }, h = f.teardown;
      f.teardown = () => {
        u(), h == null || h();
      };
    };
  }), e;
}
function Ao(e, t, r, n, i) {
  var s = () => {
    n(r[e]);
  };
  r.addEventListener(t, s), i ? Nr(() => {
    r[e] = i();
  }) : s(), (r === document.body || r === window || r === document) && fs(() => {
    r.removeEventListener(t, s);
  });
}
function Ve(e, t, r, n) {
  var K;
  var i = !0, s = (r & tl) !== 0, o = (r & rl) !== 0, l = (
    /** @type {V} */
    n
  ), f = !0, u = (
    /** @type {Derived<V> | undefined} */
    void 0
  ), h = () => o && i ? (u ?? (u = /* @__PURE__ */ wr(
    /** @type {() => V} */
    n
  )), g(u)) : (f && (f = !1, l = o ? un(
    /** @type {() => V} */
    n
  ) : (
    /** @type {V} */
    n
  )), l);
  let p;
  if (s) {
    var c = dr in e || Mi in e;
    p = ((K = Et(e, t)) == null ? void 0 : K.set) ?? (c && t in e ? (D) => e[t] = D : void 0);
  }
  var _, v = !1;
  s ? [_, v] = Il(() => (
    /** @type {V} */
    e[t]
  )) : _ = /** @type {V} */
  e[t], _ === void 0 && n !== void 0 && (_ = h(), p && (xl(), p(_)));
  var b;
  if (b = () => {
    var D = (
      /** @type {V} */
      e[t]
    );
    return D === void 0 ? h() : (f = !0, D);
  }, (r & el) === 0)
    return b;
  if (p) {
    var S = e.$$legacy;
    return (
      /** @type {() => V} */
      (function(D, Ne) {
        return arguments.length > 0 ? ((!Ne || S || v) && p(Ne ? b() : D), D) : b();
      })
    );
  }
  var x = !1, I = ((r & Qs) !== 0 ? wr : Gi)(() => (x = !1, b()));
  s && g(I);
  var X = (
    /** @type {Effect} */
    k
  );
  return (
    /** @type {() => V} */
    (function(D, Ne) {
      if (arguments.length > 0) {
        const se = Ne ? g(I) : s ? dt(D) : D;
        return O(I, se), x = !0, l !== void 0 && (l = se), D;
      }
      return nt && x || (X.f & _e) !== 0 ? I.v : g(I);
    })
  );
}
function No(e) {
  return new Ro(e);
}
var Qe, xe;
class Ro {
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * }} options
   */
  constructor(t) {
    /** @type {any} */
    E(this, Qe);
    /** @type {Record<string, any>} */
    E(this, xe);
    var s;
    var r = /* @__PURE__ */ new Map(), n = (o, l) => {
      var f = /* @__PURE__ */ rs(l, !1, !1);
      return r.set(o, f), f;
    };
    const i = new Proxy(
      { ...t.props || {}, $$events: {} },
      {
        get(o, l) {
          return g(r.get(l) ?? n(l, Reflect.get(o, l)));
        },
        has(o, l) {
          return l === Mi ? !0 : (g(r.get(l) ?? n(l, Reflect.get(o, l))), Reflect.has(o, l));
        },
        set(o, l, f) {
          return O(r.get(l) ?? n(l, f), f), Reflect.set(o, l, f);
        }
      }
    );
    $(this, xe, (t.hydrate ? uo : Ss)(t.component, {
      target: t.target,
      anchor: t.anchor,
      props: i,
      context: t.context,
      intro: t.intro ?? !1,
      recover: t.recover,
      transformError: t.transformError
    })), (!((s = t == null ? void 0 : t.props) != null && s.$$host) || t.sync === !1) && Se(), $(this, Qe, i.$$events);
    for (const o of Object.keys(a(this, xe)))
      o === "$set" || o === "$destroy" || o === "$on" || Kr(this, o, {
        get() {
          return a(this, xe)[o];
        },
        /** @param {any} value */
        set(l) {
          a(this, xe)[o] = l;
        },
        enumerable: !0
      });
    a(this, xe).$set = /** @param {Record<string, any>} next */
    (o) => {
      Object.assign(i, o);
    }, a(this, xe).$destroy = () => {
      co(a(this, xe));
    };
  }
  /** @param {Record<string, any>} props */
  $set(t) {
    a(this, xe).$set(t);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(t, r) {
    a(this, Qe)[t] = a(this, Qe)[t] || [];
    const n = (...i) => r.call(this, ...i);
    return a(this, Qe)[t].push(n), () => {
      a(this, Qe)[t] = a(this, Qe)[t].filter(
        /** @param {any} fn */
        (i) => i !== n
      );
    };
  }
  $destroy() {
    a(this, xe).$destroy();
  }
}
Qe = new WeakMap(), xe = new WeakMap();
let As;
typeof HTMLElement == "function" && (As = class extends HTMLElement {
  /**
   * @param {*} $$componentCtor
   * @param {*} $$slots
   * @param {ShadowRootInit | undefined} shadow_root_init
   */
  constructor(t, r, n) {
    super();
    /** The Svelte component constructor */
    P(this, "$$ctor");
    /** Slots */
    P(this, "$$s");
    /** @type {any} The Svelte component instance */
    P(this, "$$c");
    /** Whether or not the custom element is connected */
    P(this, "$$cn", !1);
    /** @type {Record<string, any>} Component props data */
    P(this, "$$d", {});
    /** `true` if currently in the process of reflecting component props back to attributes */
    P(this, "$$r", !1);
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    P(this, "$$p_d", {});
    /** @type {Record<string, EventListenerOrEventListenerObject[]>} Event listeners */
    P(this, "$$l", {});
    /** @type {Map<EventListenerOrEventListenerObject, Function>} Event listener unsubscribe functions */
    P(this, "$$l_u", /* @__PURE__ */ new Map());
    /** @type {any} The managed render effect for reflecting attributes */
    P(this, "$$me");
    /** @type {ShadowRoot | null} The ShadowRoot of the custom element */
    P(this, "$$shadowRoot", null);
    this.$$ctor = t, this.$$s = r, n && (this.$$shadowRoot = this.attachShadow(n));
  }
  /**
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  addEventListener(t, r, n) {
    if (this.$$l[t] = this.$$l[t] || [], this.$$l[t].push(r), this.$$c) {
      const i = this.$$c.$on(t, r);
      this.$$l_u.set(r, i);
    }
    super.addEventListener(t, r, n);
  }
  /**
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  removeEventListener(t, r, n) {
    if (super.removeEventListener(t, r, n), this.$$c) {
      const i = this.$$l_u.get(r);
      i && (i(), this.$$l_u.delete(r));
    }
  }
  async connectedCallback() {
    if (this.$$cn = !0, !this.$$c) {
      let t = function(i) {
        return (s) => {
          const o = fn("slot");
          i !== "default" && (o.name = i), G(s, o);
        };
      };
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const r = {}, n = Co(this);
      for (const i of this.$$s)
        i in n && (i === "default" && !this.$$d.children ? (this.$$d.children = t(i), r.default = !0) : r[i] = t(i));
      for (const i of this.attributes) {
        const s = this.$$g_p(i.name);
        s in this.$$d || (this.$$d[s] = Ur(s, i.value, this.$$p_d, "toProp"));
      }
      for (const i in this.$$p_d)
        !(i in this.$$d) && this[i] !== void 0 && (this.$$d[i] = this[i], delete this[i]);
      this.$$c = No({
        component: this.$$ctor,
        target: this.$$shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: r,
          $$host: this
        }
      }), this.$$me = Xl(() => {
        Nr(() => {
          var i;
          this.$$r = !0;
          for (const s of Jr(this.$$c)) {
            if (!((i = this.$$p_d[s]) != null && i.reflect)) continue;
            this.$$d[s] = this.$$c[s];
            const o = Ur(
              s,
              this.$$d[s],
              this.$$p_d,
              "toAttribute"
            );
            o == null ? this.removeAttribute(this.$$p_d[s].attribute || s) : this.setAttribute(this.$$p_d[s].attribute || s, o);
          }
          this.$$r = !1;
        });
      });
      for (const i in this.$$l)
        for (const s of this.$$l[i]) {
          const o = this.$$c.$on(i, s);
          this.$$l_u.set(s, o);
        }
      this.$$l = {};
    }
  }
  // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
  // and setting attributes through setAttribute etc, this is helpful
  /**
   * @param {string} attr
   * @param {string} _oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(t, r, n) {
    var i;
    this.$$r || (t = this.$$g_p(t), this.$$d[t] = Ur(t, n, this.$$p_d, "toProp"), (i = this.$$c) == null || i.$set({ [t]: this.$$d[t] }));
  }
  disconnectedCallback() {
    this.$$cn = !1, Promise.resolve().then(() => {
      !this.$$cn && this.$$c && (this.$$c.$destroy(), this.$$me(), this.$$c = void 0);
    });
  }
  /**
   * @param {string} attribute_name
   */
  $$g_p(t) {
    return Jr(this.$$p_d).find(
      (r) => this.$$p_d[r].attribute === t || !this.$$p_d[r].attribute && r.toLowerCase() === t
    ) || t;
  }
});
function Ur(e, t, r, n) {
  var s;
  const i = (s = r[e]) == null ? void 0 : s.type;
  if (t = i === "Boolean" && typeof t != "boolean" ? t != null : t, !n || !r[e])
    return t;
  if (n === "toAttribute")
    switch (i) {
      case "Object":
      case "Array":
        return t == null ? null : JSON.stringify(t);
      case "Boolean":
        return t ? "" : null;
      case "Number":
        return t ?? null;
      default:
        return t;
    }
  else
    switch (i) {
      case "Object":
      case "Array":
        return t && JSON.parse(t);
      case "Boolean":
        return t;
      // conversion already handled above
      case "Number":
        return t != null ? +t : t;
      default:
        return t;
    }
}
function Co(e) {
  const t = {};
  return e.childNodes.forEach((r) => {
    t[
      /** @type {Element} node */
      r.slot || "default"
    ] = !0;
  }), t;
}
function Ns(e, t, r, n, i, s) {
  let o = class extends As {
    constructor() {
      super(e, r, i), this.$$p_d = t;
    }
    static get observedAttributes() {
      return Jr(t).map(
        (l) => (t[l].attribute || l).toLowerCase()
      );
    }
  };
  return Jr(t).forEach((l) => {
    Kr(o.prototype, l, {
      get() {
        return this.$$c && l in this.$$c ? this.$$c[l] : this.$$d[l];
      },
      set(f) {
        var p;
        f = Ur(l, f, t), this.$$d[l] = f;
        var u = this.$$c;
        if (u) {
          var h = (p = Et(u, l)) == null ? void 0 : p.get;
          h ? u[l] = f : u.$set({ [l]: f });
        }
      }
    });
  }), n.forEach((l) => {
    Kr(o.prototype, l, {
      get() {
        var f;
        return (f = this.$$c) == null ? void 0 : f[l];
      }
    });
  }), e.element = /** @type {any} */
  o, o;
}
var Oo = /* @__PURE__ */ ie('<span class="worn-nav-icon svelte-1hv280f"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="svelte-1hv280f"></svg></span>'), Mo = /* @__PURE__ */ ie("<span> </span>"), Io = /* @__PURE__ */ ie('<button type="button" class="worn-reorder-btn svelte-1hv280f" title="Move up">▲</button>'), Lo = /* @__PURE__ */ ie('<button type="button" class="worn-reorder-btn svelte-1hv280f" title="Move down">▼</button>'), Do = /* @__PURE__ */ ie('<span class="worn-nav-reorder"><!> <!></span>'), Po = /* @__PURE__ */ ie('<a><!> <span class="worn-nav-label svelte-1hv280f"> </span> <!> <!></a>'), Fo = /* @__PURE__ */ ie('<button type="button" class="worn-filter-clear svelte-1hv280f" aria-label="Clear filter">×</button>'), Ho = /* @__PURE__ */ ie('<div class="worn-section-label svelte-1hv280f">Recent</div> <!> <div class="worn-section-divider svelte-1hv280f"></div>', 1), zo = /* @__PURE__ */ ie('<div class="worn-section-label svelte-1hv280f">Needs attention</div> <!> <div class="worn-section-divider svelte-1hv280f"></div>', 1), jo = /* @__PURE__ */ ie('<div class="worn-section-label svelte-1hv280f">You might want</div> <!> <div class="worn-section-divider svelte-1hv280f"></div>', 1), Bo = /* @__PURE__ */ ie('<div class="worn-section-label svelte-1hv280f">Pinned</div> <!> <div class="worn-section-divider svelte-1hv280f"></div>', 1), Vo = /* @__PURE__ */ ie('<details class="worn-nav-group svelte-1hv280f"><summary class="worn-nav-item worn-nav-summary svelte-1hv280f"><span class="worn-nav-icon svelte-1hv280f"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="svelte-1hv280f"><polyline points="9 18 15 12 9 6"></polyline></svg></span><span class="worn-nav-label svelte-1hv280f"> </span></summary> <!></details>'), Yo = /* @__PURE__ */ ie('<div class="worn-menu-backdrop svelte-1hv280f"></div> <div class="worn-context-menu svelte-1hv280f"><button type="button" class="svelte-1hv280f"> </button> <button type="button" class="svelte-1hv280f">👁 Hide</button> <button type="button" class="svelte-1hv280f">🔄 Reset all</button></div>', 1), qo = /* @__PURE__ */ ie('<div><div class="worn-sidebar-filter svelte-1hv280f"><input type="search" class="worn-filter-input svelte-1hv280f" placeholder="Filter…"/> <!></div> <nav class="worn-nav svelte-1hv280f"><div class="worn-active-indicator svelte-1hv280f"></div> <!> <!> <!> <!> <!></nav> <!></div>');
const Uo = {
  hash: "svelte-1hv280f",
  code: '.worn-sidebar-filter.svelte-1hv280f {position:relative;margin:4px 8px 8px;}.worn-filter-input.svelte-1hv280f {width:100%;padding:6px 28px 6px 10px;border:1px solid var(--worn-sidebar-border, #ddd);border-radius:6px;background:var(--worn-sidebar-bg, #f5f5f5);color:var(--worn-sidebar-text, #000);font:inherit;font-size:12px;box-sizing:border-box;}.worn-filter-input.svelte-1hv280f:focus {outline:2px dashed var(--worn-sidebar-accent, #0d9488);outline-offset:-2px;}.worn-filter-clear.svelte-1hv280f {position:absolute;right:4px;top:50%;transform:translateY(-50%);background:none;border:0;color:var(--worn-sidebar-text-muted, #666);cursor:pointer;font-size:16px;padding:2px 6px;line-height:1;}.worn-nav.svelte-1hv280f {position:relative;}.worn-nav-item.svelte-1hv280f {display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:var(--worn-nav-radius, 8px);color:var(--worn-sidebar-text, #000);text-decoration:none;font-size:13px;position:relative;cursor:pointer;min-height:36px;}.worn-nav-item.svelte-1hv280f:hover {background:var(--worn-sidebar-hover, #eef);}.worn-nav-item.active.svelte-1hv280f {background:var(--worn-sidebar-accent, #0d9488);color:var(--worn-sidebar-accent-text, #fff);}.worn-nav-icon.svelte-1hv280f {flex-shrink:0;display:flex;}.worn-nav-icon.svelte-1hv280f svg:where(.svelte-1hv280f) {display:block;}.worn-nav-label.svelte-1hv280f {flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.worn-nav-badge.svelte-1hv280f {display:inline-flex;align-items:center;justify-content:center;min-width:16px;height:16px;padding:0 5px;border-radius:8px;background:var(--worn-sidebar-accent, #0d9488);color:var(--worn-sidebar-accent-text, #fff);font-size:9px;font-weight:700;line-height:16px;text-align:center;}.worn-nav-badge.is-danger.svelte-1hv280f {background:var(--worn-sidebar-danger, #e74c3c);color:#fff;}.worn-section-label.svelte-1hv280f {font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--worn-sidebar-text-muted, #666);padding:4px 12px 2px;}.worn-section-divider.svelte-1hv280f {height:1px;background:var(--worn-sidebar-border, #ddd);margin:4px 8px;}.worn-nav-summary.svelte-1hv280f {font-weight:600;}.worn-nav-group.svelte-1hv280f {border-top:1px solid var(--worn-sidebar-border, #ddd);margin-top:4px;padding-top:4px;}.worn-nav-group.svelte-1hv280f > .worn-nav-item:where(.svelte-1hv280f) {padding-left:24px;}.worn-active-indicator.svelte-1hv280f {position:absolute;left:2px;width:calc(100% - 4px);background:var(--worn-sidebar-accent, #0d9488);border-radius:999px;transition:top 0.25s cubic-bezier(0.4, 0, 0.2, 1), height 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease;pointer-events:none;z-index:0;opacity:0;}.worn-active-indicator.svelte-1hv280f:not([style=""]) {opacity:0.15;}.worn-reorder-btn.svelte-1hv280f {background:none;border:0;color:var(--worn-sidebar-text-muted, #666);cursor:pointer;font-size:8px;padding:2px;opacity:0;transition:opacity 0.15s;min-height:unset;line-height:1;}.worn-nav-item.svelte-1hv280f:hover .worn-reorder-btn:where(.svelte-1hv280f) {opacity:0.7;}.worn-nav-item.svelte-1hv280f:hover .worn-reorder-btn:where(.svelte-1hv280f):hover {opacity:1;}.worn-menu-backdrop.svelte-1hv280f {position:fixed;inset:0;z-index:100;}.worn-context-menu.svelte-1hv280f {position:fixed;z-index:101;background:var(--worn-sidebar-surface, #fff);border:1px solid var(--worn-sidebar-border, #ddd);border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.15);min-width:140px;overflow:hidden;transform:translate(4px, 4px);}.worn-context-menu.svelte-1hv280f button:where(.svelte-1hv280f) {display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px;border:0;background:transparent;color:var(--worn-sidebar-text, #000);font:inherit;font-size:12px;cursor:pointer;text-align:left;min-height:36px;}.worn-context-menu.svelte-1hv280f button:where(.svelte-1hv280f):hover {background:var(--worn-sidebar-hover, #eef);}'
};
function Rs(e, t) {
  zn(t, !0), wo(e, Uo);
  const r = (d, w = Ri) => {
    var m = Po();
    let R;
    var F = oe(m);
    {
      var rr = (B) => {
        var le = Oo(), lt = oe(le);
        go(lt, () => w().icon, !0), Z(lt), Z(le), G(B, le);
      };
      be(F, (B) => {
        w().icon && B(rr);
      });
    }
    var ce = z(F, 2), it = oe(ce, !0);
    Z(ce);
    var st = z(ce, 2);
    {
      var Dr = (B) => {
        var le = Mo();
        let lt;
        var hn = oe(le, !0);
        Z(le), Ft(() => {
          lt = bn(le, 1, "worn-nav-badge svelte-1hv280f", null, lt, { "is-danger": w().badgeVariant === "danger" }), Hr(hn, w().badge);
        }), G(B, le);
      };
      be(st, (B) => {
        w().badge !== void 0 && w().badge > 0 && B(Dr);
      });
    }
    var dn = z(st, 2);
    {
      var vn = (B) => {
        var le = Do(), lt = oe(le);
        {
          var hn = (pt) => {
            var nr = Io();
            ze("click", nr, (ir) => {
              ir.stopPropagation(), ir.preventDefault(), I(w().id, -1);
            }), G(pt, nr);
          }, Ys = /* @__PURE__ */ He(() => g(q).indexOf(w()) > 0);
          be(lt, (pt) => {
            g(Ys) && pt(hn);
          });
        }
        var qs = z(lt, 2);
        {
          var Us = (pt) => {
            var nr = Lo();
            ze("click", nr, (ir) => {
              ir.stopPropagation(), ir.preventDefault(), I(w().id, 1);
            }), G(pt, nr);
          }, Gs = /* @__PURE__ */ He(() => g(q).indexOf(w()) < g(q).length - 1);
          be(qs, (pt) => {
            g(Gs) && pt(Us);
          });
        }
        Z(le), G(B, le);
      }, Je = /* @__PURE__ */ He(() => g(c).has(w().id));
      be(dn, (B) => {
        g(Je) && B(vn);
      });
    }
    Z(m), Ft(
      (B, le) => {
        gr(m, "href", w().href || "#"), R = bn(m, 1, "worn-nav-item svelte-1hv280f", null, R, B), gr(m, "data-nav-id", w().id), gr(m, "aria-current", le), Hr(it, w().label);
      },
      [
        () => ({ active: ei(w()) }),
        () => ei(w()) ? "page" : void 0
      ]
    ), ze("click", m, (B) => Os(B, w().href)), ze("contextmenu", m, (B) => X(B, w().id)), G(d, m);
  };
  let n = Ve(t, "items", 7), i = Ve(t, "activeHref", 7, ""), s = Ve(t, "collapsed", 15, !1), o = Ve(t, "rounded", 7, "md"), l = Ve(t, "onnavigate", 7), f = Ve(t, "oncollapsed", 7), u = /* @__PURE__ */ W(!0), h = /* @__PURE__ */ W(""), p = /* @__PURE__ */ W(-1), c = /* @__PURE__ */ W(dt(/* @__PURE__ */ new Set())), _ = /* @__PURE__ */ W(dt([])), v = /* @__PURE__ */ W(null), b = /* @__PURE__ */ W("");
  Fr(() => {
    const d = i();
    if (!(!d || d === "/" || d === g(_)[0]))
      try {
        const w = JSON.parse(localStorage.getItem("wornpage-sidebar-recent") || "[]");
        O(_, [d, ...w.filter((m) => m !== d)].slice(0, 5), !0), localStorage.setItem("wornpage-sidebar-recent", JSON.stringify(g(_)));
      } catch {
      }
  }), Fr(() => {
    try {
      const d = localStorage.getItem("wornpage-sidebar-favorites");
      d && O(c, new Set(JSON.parse(d)), !0);
    } catch {
    }
    try {
      const d = localStorage.getItem("wornpage-sidebar-recent");
      d && O(_, JSON.parse(d), !0);
    } catch {
    }
    try {
      localStorage.getItem("wornpage-sidebar-more-open") === "0" && O(u, !1);
    } catch {
    }
  });
  function S(d) {
    try {
      localStorage.setItem("wornpage-sidebar-favorites", JSON.stringify([...d]));
    } catch {
    }
  }
  function x(d) {
    const w = new Set(g(c));
    w.has(d) ? w.delete(d) : w.add(d), O(c, w, !0), S(w);
  }
  function I(d, w) {
    const m = [...g(c)], R = m.indexOf(d);
    if (R < 0) return;
    const F = R + w;
    F < 0 || F >= m.length || ([m[R], m[F]] = [m[F], m[R]], O(c, new Set(m), !0), S(g(c)));
  }
  function X(d, w) {
    d.preventDefault(), O(v, { x: d.clientX, y: d.clientY, id: w }, !0);
  }
  function K() {
    O(v, null);
  }
  function D(d) {
    const w = new Set(g(c));
    w.delete(d), O(c, w, !0), S(w), O(_, g(_).filter((m) => m !== "/" + d), !0), K();
  }
  function Ne() {
    O(c, /* @__PURE__ */ new Set(), !0), S(/* @__PURE__ */ new Set()), O(_, [], !0);
    try {
      localStorage.removeItem("wornpage-sidebar-recent");
    } catch {
    }
    K();
  }
  function se(d) {
    const w = [];
    for (const m of d)
      w.push(m), m.children && w.push(...se(m.children));
    return w;
  }
  const ge = /* @__PURE__ */ He(() => se(n())), q = /* @__PURE__ */ He(() => g(ge).filter((d) => g(c).has(d.id) && (!g(h) || d.label.toLowerCase().includes(g(h).toLowerCase()))));
  function we(d) {
    if (!g(h)) return d;
    const w = g(h).toLowerCase();
    return d.filter((m) => m.label.toLowerCase().includes(w));
  }
  const tr = /* @__PURE__ */ He(() => we(n())), Cr = /* @__PURE__ */ He(() => g(_).map((d) => g(ge).find((w) => w.href === d)).filter(Boolean)), Xn = /* @__PURE__ */ He(() => g(ge).filter((d) => d.attention || d.badge && d.badge > 0)), Zn = /* @__PURE__ */ He(() => i() ? g(ge).filter((d) => {
    var m;
    const w = g(ge).find((R) => R.href === i());
    return w && ((m = d.relatedTo) == null ? void 0 : m.includes(w.id));
  }) : []), Qn = /* @__PURE__ */ He(() => [
    ...g(q),
    ...g(tr).filter((d) => !g(c).has(d.id) && !d.children),
    ...g(u) ? g(tr).filter((d) => !g(c).has(d.id) && d.children) : []
  ]);
  function Cs(d) {
    var m;
    const w = g(Qn).length;
    if (w !== 0) {
      if (d.key === "ArrowDown")
        d.preventDefault(), O(p, Math.min(g(p) + 1, w - 1), !0), Or(g(p));
      else if (d.key === "ArrowUp")
        d.preventDefault(), O(p, Math.max(g(p) - 1, 0), !0), Or(g(p));
      else if (d.key === "Home")
        d.preventDefault(), O(p, 0), Or(0);
      else if (d.key === "End")
        d.preventDefault(), O(p, w - 1), Or(w - 1);
      else if ((d.key === "Enter" || d.key === " ") && g(p) >= 0) {
        d.preventDefault();
        const R = g(Qn)[g(p)];
        R != null && R.href && ((m = l()) == null || m(R.href));
      }
    }
  }
  function Or(d) {
    var m;
    const w = (m = g(Mt)) == null ? void 0 : m.querySelectorAll("[data-nav-id]")[d];
    w == null || w.focus();
  }
  function Os(d, w) {
    var m;
    d.preventDefault(), w && ((m = l()) == null || m(w));
  }
  function ei(d) {
    return d.href ? i() === d.href : !1;
  }
  let Mt = /* @__PURE__ */ W(void 0);
  Fr(() => {
    const d = { sm: "4px", md: "8px", lg: "12px", pill: "999px" };
    try {
      document.documentElement.style.setProperty("--worn-nav-radius", d[o()] || "8px");
    } catch {
    }
  });
  function Ms() {
    if (!g(Mt) || s()) {
      O(b, "");
      return;
    }
    const d = g(Mt).querySelector(".worn-nav-item.active");
    if (d) {
      const w = g(Mt).getBoundingClientRect(), m = d.getBoundingClientRect();
      O(b, `top:${m.top - w.top}px;height:${m.height}px;`);
    }
  }
  Fr(() => {
    i(), s(), requestAnimationFrame(() => Ms());
  });
  var Is = {
    get items() {
      return n();
    },
    set items(d) {
      n(d), Se();
    },
    get activeHref() {
      return i();
    },
    set activeHref(d = "") {
      i(d), Se();
    },
    get collapsed() {
      return s();
    },
    set collapsed(d = !1) {
      s(d), Se();
    },
    get rounded() {
      return o();
    },
    set rounded(d = "md") {
      o(d), Se();
    },
    get onnavigate() {
      return l();
    },
    set onnavigate(d) {
      l(d), Se();
    },
    get oncollapsed() {
      return f();
    },
    set oncollapsed(d) {
      f(d), Se();
    }
  }, Mr = qo();
  let ti;
  var cn = oe(Mr), Ir = oe(cn);
  Eo(Ir);
  var Ls = z(Ir, 2);
  {
    var Ds = (d) => {
      var w = Fo();
      ze("click", w, () => O(h, "")), G(d, w);
    };
    be(Ls, (d) => {
      g(h) && d(Ds);
    });
  }
  Z(cn);
  var Lr = z(cn, 2), ri = oe(Lr), ni = z(ri, 2);
  {
    var Ps = (d) => {
      var w = Ho(), m = z(Lt(w), 2);
      Dt(m, 17, () => g(Cr).slice(0, 3), (R) => R.id, (R, F) => {
        r(R, () => g(F));
      }), or(2), G(d, w);
    };
    be(ni, (d) => {
      g(Cr).length > 0 && !g(h) && d(Ps);
    });
  }
  var ii = z(ni, 2);
  {
    var Fs = (d) => {
      var w = zo(), m = z(Lt(w), 2);
      Dt(m, 17, () => g(Xn).slice(0, 3), (R) => R.id, (R, F) => {
        r(R, () => g(F));
      }), or(2), G(d, w);
    };
    be(ii, (d) => {
      g(Xn).length > 0 && !g(h) && d(Fs);
    });
  }
  var si = z(ii, 2);
  {
    var Hs = (d) => {
      var w = jo(), m = z(Lt(w), 2);
      Dt(m, 17, () => g(Zn).slice(0, 3), (R) => R.id, (R, F) => {
        r(R, () => g(F));
      }), or(2), G(d, w);
    };
    be(si, (d) => {
      g(Zn).length > 0 && !g(h) && d(Hs);
    });
  }
  var li = z(si, 2);
  {
    var zs = (d) => {
      var w = Bo(), m = z(Lt(w), 2);
      Dt(m, 17, () => g(q), (R) => R.id, (R, F) => {
        r(R, () => g(F));
      }), or(2), G(d, w);
    };
    be(li, (d) => {
      g(q).length > 0 && d(zs);
    });
  }
  var js = z(li, 2);
  Dt(js, 17, () => g(tr).filter((d) => !g(c).has(d.id)), (d) => d.id, (d, w) => {
    var m = oo(), R = Lt(m);
    {
      var F = (ce) => {
        var it = Vo(), st = oe(it), Dr = z(oe(st)), dn = oe(Dr, !0);
        Z(Dr), Z(st);
        var vn = z(st, 2);
        Dt(vn, 17, () => we(g(w).children).filter((Je) => !g(c).has(Je.id)), (Je) => Je.id, (Je, B) => {
          r(Je, () => g(B));
        }), Z(it), Ft(() => Hr(dn, g(w).label)), Ao("open", "toggle", it, (Je) => O(u, Je), () => g(u)), G(ce, it);
      }, rr = (ce) => {
        r(ce, () => g(w));
      };
      be(R, (ce) => {
        g(w).children ? ce(F) : ce(rr, -1);
      });
    }
    G(d, m);
  }), Z(Lr), Ts(Lr, (d) => O(Mt, d), () => g(Mt));
  var Bs = z(Lr, 2);
  {
    var Vs = (d) => {
      var w = Yo(), m = Lt(w), R = z(m, 2), F = oe(R), rr = oe(F, !0);
      Z(F);
      var ce = z(F, 2), it = z(ce, 2);
      Z(R), Ft(
        (st) => {
          mi(R, `left:${g(v).x ?? ""}px;top:${g(v).y ?? ""}px`), Hr(rr, st);
        },
        [
          () => g(c).has(g(v).id) ? "📌 Unpin" : "📌 Pin"
        ]
      ), ze("click", m, K), ze("click", F, () => {
        x(g(v).id), K();
      }), ze("click", ce, () => D(g(v).id)), ze("click", it, Ne), G(d, w);
    };
    be(Bs, (d) => {
      g(v) && d(Vs);
    });
  }
  return Z(Mr), Ft(() => {
    ti = bn(Mr, 1, "worn-sidebar", null, ti, { "is-collapsed": s() }), mi(ri, g(b));
  }), ze("keydown", Ir, Cs), To(Ir, () => g(h), (d) => O(h, d)), G(e, Mr), jn(Is);
}
io(["click", "contextmenu", "keydown"]);
Ns(
  Rs,
  {
    items: {},
    activeHref: {},
    collapsed: {},
    rounded: {},
    onnavigate: {},
    oncollapsed: {}
  },
  [],
  [],
  { mode: "open" }
);
var Go = /* @__PURE__ */ ie('<div style="height:100%"><!></div>');
function Jo(e, t) {
  zn(t, !0);
  let r = Ve(t, "items", 23, () => []), n = Ve(t, "activehref", 7, ""), i = Ve(t, "collapsed", 7, !1), s = Ve(t, "rounded", 7, "md"), o;
  function l(p, c) {
    o == null || o.dispatchEvent(new CustomEvent(p, { detail: c, bubbles: !0 }));
  }
  var f = {
    get items() {
      return r();
    },
    set items(p = []) {
      r(p), Se();
    },
    get activehref() {
      return n();
    },
    set activehref(p = "") {
      n(p), Se();
    },
    get collapsed() {
      return i();
    },
    set collapsed(p = !1) {
      i(p), Se();
    },
    get rounded() {
      return s();
    },
    set rounded(p = "md") {
      s(p), Se();
    }
  }, u = Go(), h = oe(u);
  return Rs(h, {
    get items() {
      return r();
    },
    get activeHref() {
      return n();
    },
    get rounded() {
      return s();
    },
    onnavigate: (p) => l("worn-nav", { href: p }),
    oncollapsed: (p) => l("worn-collapse", { collapsed: p }),
    get collapsed() {
      return i();
    },
    set collapsed(p) {
      i(p);
    }
  }), Z(u), Ts(u, (p) => o = p, () => o), G(e, u), jn(f);
}
customElements.define("worn-sidebar", Ns(
  Jo,
  {
    items: { type: "Array" },
    activehref: {},
    collapsed: { type: "Boolean" },
    rounded: {}
  },
  [],
  []
));
export {
  Jo as default
};
