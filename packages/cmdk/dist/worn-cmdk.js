//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region node_modules/svelte/src/constants.js
var e = {}, t = Symbol("uninitialized"), n = "http://www.w3.org/1999/xhtml", r = Array.isArray, i = Array.prototype.indexOf, a = Array.prototype.includes, o = Array.from, s = Object.keys, c = Object.defineProperty, l = Object.getOwnPropertyDescriptor, u = Object.getOwnPropertyDescriptors, d = Object.prototype, f = Array.prototype, p = Object.getPrototypeOf, m = Object.isExtensible, h = () => {};
function g(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function _() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
function v(e, t) {
	if (Array.isArray(e)) return e;
	if (t === void 0 || !(Symbol.iterator in e)) return Array.from(e);
	let n = [];
	for (let r of e) if (n.push(r), n.length === t) break;
	return n;
}
var y = 1024, b = 2048, x = 4096, S = 8192, ee = 16384, C = 32768, te = 1 << 25, ne = 65536, re = 1 << 19, ie = 1 << 20, ae = 1 << 25, oe = 65536, se = 1 << 21, ce = 1 << 22, le = 1 << 23, ue = Symbol("$state"), de = Symbol("legacy props"), fe = Symbol(""), pe = Symbol("attributes"), me = Symbol("class"), he = Symbol("style"), ge = Symbol("text"), _e = Symbol("form reset"), ve = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ye = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function be() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function xe(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Se(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Ce() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function we(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Te() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ee() {
	throw Error("https://svelte.dev/e/hydration_failed");
}
function De(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Oe() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function ke() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ae() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function je() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
function Me() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Ne(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Pe() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var w = !1;
function T(e) {
	w = e;
}
var E;
function D(t) {
	if (t === null) throw Ne(), e;
	return E = t;
}
function Fe() {
	return D(/* @__PURE__ */ R(E));
}
function O(t) {
	if (w) {
		if (/* @__PURE__ */ R(E) !== null) throw Ne(), e;
		E = t;
	}
}
function Ie(e = 1) {
	if (w) {
		for (var t = e, n = E; t--;) n = /* @__PURE__ */ R(n);
		E = n;
	}
}
function Le(e = !0) {
	for (var t = 0, n = E;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ R(n);
		e && n.remove(), n = i;
	}
}
function Re(t) {
	if (!t || t.nodeType !== 8) throw Ne(), e;
	return t.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function ze(e) {
	return e === this.v;
}
function Be(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Ve(e) {
	return !Be(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var k = null;
function He(e) {
	k = e;
}
function Ue(e, t = !1, n) {
	k = {
		p: k,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: q,
		l: null
	};
}
function We(e) {
	var t = k, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) _n(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, k = t.p, e ?? {};
}
function Ge() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ke = [];
function qe() {
	var e = Ke;
	Ke = [], g(e);
}
function A(e) {
	if (Ke.length === 0 && !Ot) {
		var t = Ke;
		queueMicrotask(() => {
			t === Ke && qe();
		});
	}
	Ke.push(e);
}
function Je() {
	for (; Ke.length > 0;) qe();
}
function Ye(e) {
	var t = q;
	if (t === null) return W.f |= le, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	Xe(e, t);
}
function Xe(e, t) {
	if (!(t !== null && t.f & 16384)) {
		for (; t !== null;) {
			if (t.f & 128) {
				if (!(t.f & 32768)) throw e;
				try {
					t.b.error(e);
					return;
				} catch (t) {
					e = t;
				}
			}
			t = t.parent;
		}
		throw e;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var Ze = ~(b | x | y);
function j(e, t) {
	e.f = e.f & Ze | t;
}
function Qe(e) {
	e.f & 512 || e.deps === null ? j(e, y) : j(e, x);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function $e(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= oe, $e(t.deps));
}
function et(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), $e(e.deps), j(e, y);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var tt = !1;
function nt(e) {
	var t = tt;
	try {
		return tt = !1, [e(), tt];
	} finally {
		tt = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
var rt = !1;
function it() {
	rt || (rt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[_e]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function at(e) {
	var t = W, n = q;
	K(null), J(null);
	try {
		return e();
	} finally {
		K(t), J(n);
	}
}
function ot(e, t, n, r = n) {
	e.addEventListener(t, () => at(n));
	let i = e[_e];
	i ? e[_e] = () => {
		i(), r(!0);
	} : e[_e] = () => r(!0), it();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function st(e) {
	let t = 0, n = Kt(0), r;
	return () => {
		mn() && ($(n), Sn(() => (t === 0 && (r = er(() => e(() => Xt(n)))), t += 1, () => {
			A(() => {
				--t, t === 0 && (r?.(), r = void 0, Xt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ct = ne | re;
function lt(e, t, n, r) {
	new ut(e, t, n, r);
}
var ut = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = w ? E : null;
	#n;
	#r;
	#i;
	#a = null;
	#o = null;
	#s = null;
	#c = null;
	#l = 0;
	#u = 0;
	#d = !1;
	#f = /* @__PURE__ */ new Set();
	#p = /* @__PURE__ */ new Set();
	#m = null;
	#h = st(() => (this.#m = Kt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = q;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = q.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = wn(() => {
			if (w) {
				let e = this.#t;
				Fe();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, ct), w && (this.#e = E);
	}
	#g() {
		try {
			this.#a = V(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		A(r), t && (this.#s = V(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Pe();
				return;
			}
			t = !0, n && je(), this.#s !== null && An(this.#s, () => {
				this.#s = null;
			}), this.#S(() => {
				this.#b();
			});
		};
		return {
			reset: r,
			invoke_onerror: () => {
				try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					Xe(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = V(() => e(this.#e)), A(() => {
			var e = this.#c = document.createDocumentFragment(), t = L();
			e.append(t), this.#a = this.#S(() => V(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, An(this.#o, () => {
				this.#o = null;
			}), this.#x(M));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = V(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Pn(this.#a, e);
				let t = this.#n.pending;
				this.#o = V(() => t(this.#e));
			} else this.#x(M);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		et(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = q, n = W, r = k;
		J(this.#i), K(this.#i), He(this.#i.ctx);
		try {
			return Pt.ensure(), e();
		} catch (e) {
			return Ye(e), null;
		} finally {
			J(t), K(n), He(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && An(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, A(() => {
			this.#d = !1, this.#m && Jt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), $(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		M?.is_fork ? (this.#a && M.skip_effect(this.#a), this.#o && M.skip_effect(this.#o), this.#s && M.skip_effect(this.#s), M.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (H(this.#a), null), this.#o &&= (H(this.#o), null), this.#s &&= (H(this.#s), null), w && (D(this.#t), Ie(), D(Le()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return V(() => {
						var r = q;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return Xe(e, this.#i.parent), null;
				}
			}));
		};
		A(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				Xe(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => Xe(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function dt(e, t, n, r) {
	let i = Ge() ? ht : yt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = q, c = ft(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				Xe(e, s);
			}
			pt();
		}
	}
	var d = mt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ _t(e))).then(u).catch((e) => Xe(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), pt();
	}) : f();
}
function ft() {
	var e = q, t = W, n = k, r = M;
	return function(i = !0) {
		J(e), K(t), He(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function pt(e = !0) {
	J(null), K(null), He(null), e && M?.deactivate();
}
function mt() {
	var e = q, t = e.b, n = M, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ht(e) {
	var n = 2 | b;
	return q !== null && (q.f |= re), {
		ctx: k,
		deps: null,
		effects: null,
		equals: ze,
		f: n,
		fn: e,
		reactions: null,
		rv: 0,
		v: t,
		wv: 0,
		parent: q,
		ac: null
	};
}
var gt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function _t(e, n, r) {
	let i = q;
	i === null && be();
	var a = void 0, o = Kt(t), s = !W, c = /* @__PURE__ */ new Set();
	return xn(() => {
		var t = q, n = _();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ve && n.reject(e);
			}).finally(pt);
		} catch (e) {
			n.reject(e), pt();
		}
		var r = M;
		if (s) {
			if (t.f & 32768) var l = mt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(gt);
			else for (let e of c.values()) e.reject(gt);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== gt && (r.activate(), t ? (o.f |= le, Jt(o, t)) : (o.f & 8388608 && (o.f ^= le), Jt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), hn(() => {
		for (let e of c) e.reject(gt);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === a ? e(o) : t(a);
			}
			n.then(r, r);
		}
		t(a);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function vt(e) {
	let t = /* @__PURE__ */ ht(e);
	return Rn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function yt(e) {
	let t = /* @__PURE__ */ ht(e);
	return t.equals = Ve, t;
}
function bt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) H(t[n]);
	}
}
function xt(e) {
	var n, r = q, i = e.parent;
	if (!U && i !== null && e.v !== t && i.f & 24576) return Me(), e.v;
	J(i);
	try {
		e.f &= ~oe, bt(e), n = qn(e);
	} finally {
		J(r);
	}
	return n;
}
function St(e) {
	var t = xt(e);
	if (!e.equals(t) && (e.wv = Wn(), (!M?.is_fork || e.deps === null) && (M === null ? e.v = t : (M.capture(e, t, !0), Et?.capture(e, t, !0)), e.deps === null))) {
		j(e, y);
		return;
	}
	U || (N === null ? Qe(e) : (mn() || M?.is_fork) && N.set(e, t));
}
function Ct(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && at(() => {
		t.ac.abort(ve), t.ac = null;
	}), t.fn !== null && (t.teardown = h), Yn(t, 0), En(t));
}
function wt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Xn(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Tt = null, M = null, Et = null, N = null, Dt = null, Ot = !1, kt = !1, At = null, jt = null, Mt = 0, Nt = 1, Pt = class e {
	id = Nt++;
	#e = !1;
	linked = !0;
	#t = null;
	#n = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Set();
	#a = 0;
	#o = /* @__PURE__ */ new Map();
	#s = null;
	#c = [];
	#l = [];
	#u = /* @__PURE__ */ new Set();
	#d = /* @__PURE__ */ new Set();
	#f = /* @__PURE__ */ new Map();
	#p = /* @__PURE__ */ new Set();
	is_fork = !1;
	#m = !1;
	constructor() {
		Tt === null ? Tt = this : (Tt.#n = this, this.#t = Tt), Tt = this;
	}
	#h() {
		if (this.is_fork) return !0;
		for (let n of this.#o.keys()) {
			for (var e = n, t = !1; e.parent !== null;) {
				if (this.#f.has(e)) {
					t = !0;
					break;
				}
				e = e.parent;
			}
			if (!t) return !0;
		}
		return !1;
	}
	skip_effect(e) {
		this.#f.has(e) || this.#f.set(e, {
			d: [],
			m: []
		}), this.#p.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#f.get(e);
		if (n) {
			this.#f.delete(e);
			for (var r of n.d) j(r, b), t(r);
			for (r of n.m) j(r, x), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Mt++ > 1e3 && (this.#x(), It());
		for (let e of this.#u) this.#d.delete(e), j(e, b), this.schedule(e);
		for (let e of this.#d) j(e, x), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = At = [], r = [], i = jt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Ht(e), this.#h() || this.discard(), t;
		}
		if (M = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (At = null, jt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Vt(e, t);
			i.length > 0 && M.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), Et = this, Lt(r), Lt(n), Et = null, this.#s?.resolve();
		var s = M;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) if (s !== null) {
			let e = s;
			e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
		} else s = this;
		s !== null && s.#g();
	}
	#_(e, t, n) {
		e.f ^= y;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = (i & 96) != 0;
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= y : i & 4 ? t.push(r) : Gn(r) && (i & 16 && this.#d.add(r), Xn(r));
				var o = r.first;
				if (o !== null) {
					r = o;
					continue;
				}
			}
			for (; r !== null;) {
				var s = r.next;
				if (s !== null) {
					r = s;
					break;
				}
				r = r.parent;
			}
		}
	}
	#v() {
		for (var e = this.#t; e !== null;) {
			if (!e.is_fork) {
				for (let [t, [, n]] of this.current) if (e.current.has(t) && !n) return e;
			}
			e = e.#t;
		}
		return null;
	}
	#y(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_effects(e.#u, e.#d);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null && !(e.f & 2 && !(e.f & 6144))) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), j(i, b), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), M = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) et(e[t], this.#u, this.#d);
	}
	capture(e, n, r = !1) {
		e.v !== t && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [n, r]), N?.set(e, n)), this.is_fork || (e.v = n);
	}
	activate() {
		M = this;
	}
	deactivate() {
		M = null, N = null;
	}
	flush() {
		try {
			kt = !0, M = this, this.#g();
		} finally {
			Mt = 0, Dt = null, At = null, jt = null, kt = !1, M = null, N = null, Wt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(gt);
		this.#x(), this.#s?.resolve();
	}
	register_created_effect(e) {
		this.#l.push(e);
	}
	increment(e, t) {
		if (this.#a += 1, e) {
			let e = this.#o.get(t) ?? 0;
			this.#o.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#a, e) {
			let e = this.#o.get(t) ?? 0;
			e === 1 ? this.#o.delete(t) : this.#o.set(t, e - 1);
		}
		this.#m || (this.#m = !0, A(() => {
			this.#m = !1, this.linked && this.flush();
		}));
	}
	transfer_effects(e, t) {
		for (let t of e) this.#u.add(t);
		for (let e of t) this.#d.add(e);
		e.clear(), t.clear();
	}
	oncommit(e) {
		this.#r.add(e);
	}
	ondiscard(e) {
		this.#i.add(e);
	}
	settled() {
		return (this.#s ??= _()).promise;
	}
	static ensure() {
		if (M === null) {
			let t = M = new e();
			!kt && !Ot && A(() => {
				t.#e || t.flush();
			});
		}
		return M;
	}
	apply() {
		N = null;
	}
	schedule(e) {
		if (Dt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (At !== null && t === q && (W === null || !(W.f & 2))) return;
			if (n & 96) {
				if (!(n & 1024)) return;
				t.f ^= y;
			}
		}
		this.#c.push(t);
	}
	#x() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? Tt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Ft(e) {
	var t = Ot;
	Ot = !0;
	try {
		var n;
		for (e && (M !== null && !M.is_fork && M.flush(), n = e());;) {
			if (Je(), M === null) return n;
			M.flush();
		}
	} finally {
		Ot = t;
	}
}
function It() {
	try {
		Te();
	} catch (e) {
		Xe(e, Dt);
	}
}
var P = null;
function Lt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Gn(r) && (P = /* @__PURE__ */ new Set(), Xn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && kn(r), P?.size > 0)) {
				Wt.clear();
				for (let e of P) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) P.has(n) && (P.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Xn(n);
					}
				}
				P.clear();
			}
		}
		P = null;
	}
}
function Rt(e, t, n, r) {
	if (!n.has(e) && (n.add(e), e.reactions !== null)) for (let i of e.reactions) {
		let e = i.f;
		e & 2 ? Rt(i, t, n, r) : e & 4194320 && !(e & 2048) && zt(i, t, r) && (j(i, b), Bt(i));
	}
}
function zt(e, t, n) {
	let r = n.get(e);
	if (r !== void 0) return r;
	if (e.deps !== null) for (let r of e.deps) {
		if (a.call(t, r)) return !0;
		if (r.f & 2 && zt(r, t, n)) return n.set(r, !0), !0;
	}
	return n.set(e, !1), !1;
}
function Bt(e) {
	M.schedule(e);
}
function Vt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), j(e, y);
		for (var n = e.first; n !== null;) Vt(n, t), n = n.next;
	}
}
function Ht(e) {
	j(e, y);
	for (var t = e.first; t !== null;) Ht(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Ut = /* @__PURE__ */ new Set(), Wt = /* @__PURE__ */ new Map(), Gt = !1;
function Kt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: ze,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function F(e, t) {
	let n = Kt(e, t);
	return Rn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function qt(e, t = !1, n = !0) {
	let r = Kt(e);
	return t || (r.equals = Ve), r;
}
function I(e, t, n = !1) {
	return W !== null && (!G || W.f & 131072) && Ge() && W.f & 4325394 && (Y === null || !Y.has(e)) && Ae(), Jt(e, n ? Qt(t) : t, jt);
}
function Jt(e, t, n = null) {
	if (!e.equals(t)) {
		Wt.set(e, U ? t : e.v);
		var r = Pt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && xt(t), N === null && Qe(t);
		}
		e.wv = Wn(), Zt(e, b, n), Ge() && q !== null && q.f & 1024 && !(q.f & 96) && (Q === null ? zn([e]) : Q.push(e)), !r.is_fork && Ut.size > 0 && !Gt && Yt();
	}
	return t;
}
function Yt() {
	Gt = !1;
	for (let e of Ut) {
		e.f & 1024 && j(e, x);
		let t;
		try {
			t = Gn(e);
		} catch {
			t = !0;
		}
		t && Xn(e);
	}
	Ut.clear();
}
function Xt(e) {
	I(e, e.v + 1);
}
function Zt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ge(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === q)) {
			var l = (c & b) === 0;
			if (l && j(s, t), c & 131072) Ut.add(s);
			else if (c & 2) {
				var u = s;
				N?.delete(u), c & 65536 || (c & 512 && (q === null || !(q.f & 2097152)) && (s.f |= oe), Zt(u, x, n));
			} else if (l) {
				var d = s;
				c & 16 && P !== null && P.add(d), n === null ? Bt(d) : n.push(d);
			}
		}
	}
}
function Qt(e) {
	if (typeof e != "object" || !e || ue in e) return e;
	let n = p(e);
	if (n !== d && n !== f) return e;
	var i = /* @__PURE__ */ new Map(), a = r(e), o = /* @__PURE__ */ F(0), s = null, c = Hn, u = (e) => {
		if (Hn === c) return e();
		var t = W, n = Hn;
		K(null), Un(c);
		var r = e();
		return K(t), Un(n), r;
	};
	return a && i.set("length", /* @__PURE__ */ F(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Oe();
			var r = i.get(t);
			return r === void 0 ? u(() => {
				var e = /* @__PURE__ */ F(n.value, s);
				return i.set(t, e), e;
			}) : I(r, n.value, !0), !0;
		},
		deleteProperty(e, n) {
			var r = i.get(n);
			if (r === void 0) {
				if (n in e) {
					let e = u(() => /* @__PURE__ */ F(t, s));
					i.set(n, e), Xt(o);
				}
			} else I(r, t), Xt(o);
			return !0;
		},
		get(n, r, a) {
			if (r === ue) return e;
			var o = i.get(r), c = r in n;
			if (o === void 0 && (!c || l(n, r)?.writable) && (o = u(() => /* @__PURE__ */ F(Qt(c ? n[r] : t), s)), i.set(r, o)), o !== void 0) {
				var d = $(o);
				return d === t ? void 0 : d;
			}
			return Reflect.get(n, r, a);
		},
		getOwnPropertyDescriptor(e, n) {
			var r = Reflect.getOwnPropertyDescriptor(e, n);
			if (r && "value" in r) {
				var a = i.get(n);
				a && (r.value = $(a));
			} else if (r === void 0) {
				var o = i.get(n), s = o?.v;
				if (o !== void 0 && s !== t) return {
					enumerable: !0,
					configurable: !0,
					value: s,
					writable: !0
				};
			}
			return r;
		},
		has(e, n) {
			if (n === ue) return !0;
			var r = i.get(n), a = r !== void 0 && r.v !== t || Reflect.has(e, n);
			return (r !== void 0 || q !== null && (!a || l(e, n)?.writable)) && (r === void 0 && (r = u(() => /* @__PURE__ */ F(a ? Qt(e[n]) : t, s)), i.set(n, r)), $(r) === t) ? !1 : a;
		},
		set(e, n, r, c) {
			var d = i.get(n), f = n in e;
			if (a && n === "length") for (var p = r; p < d.v; p += 1) {
				var m = i.get(p + "");
				m === void 0 ? p in e && (m = u(() => /* @__PURE__ */ F(t, s)), i.set(p + "", m)) : I(m, t);
			}
			if (d === void 0) (!f || l(e, n)?.writable) && (d = u(() => /* @__PURE__ */ F(void 0, s)), I(d, Qt(r)), i.set(n, d));
			else {
				f = d.v !== t;
				var h = u(() => Qt(r));
				I(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, n);
			if (g?.set && g.set.call(c, r), !f) {
				if (a && typeof n == "string") {
					var _ = i.get("length"), v = Number(n);
					Number.isInteger(v) && v >= _.v && I(_, v + 1);
				}
				Xt(o);
			}
			return !0;
		},
		ownKeys(e) {
			$(o);
			var n = Reflect.ownKeys(e).filter((e) => {
				var n = i.get(e);
				return n === void 0 || n.v !== t;
			});
			for (var [r, a] of i) a.v !== t && !(r in e) && n.push(r);
			return n;
		},
		setPrototypeOf() {
			ke();
		}
	});
}
var $t, en, tn, nn;
function rn() {
	if ($t === void 0) {
		$t = window, en = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		tn = l(t, "firstChild").get, nn = l(t, "nextSibling").get, m(e) && (e[me] = void 0, e[pe] = null, e[he] = void 0, e.__e = void 0), m(n) && (n[ge] = void 0);
	}
}
function L(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function an(e) {
	return tn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function R(e) {
	return nn.call(e);
}
function z(e, t) {
	if (!w) return /* @__PURE__ */ an(e);
	var n = /* @__PURE__ */ an(E);
	if (n === null) n = E.appendChild(L());
	else if (t && n.nodeType !== 3) {
		var r = L();
		return n?.before(r), D(r), r;
	}
	return t && dn(n), D(n), n;
}
function on(e, t = !1) {
	if (!w) {
		var n = /* @__PURE__ */ an(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ R(n) : n;
	}
	if (t) {
		if (E?.nodeType !== 3) {
			var r = L();
			return E?.before(r), D(r), r;
		}
		dn(E);
	}
	return E;
}
function sn(e, t = 1, n = !1) {
	let r = w ? E : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ R(r);
	if (!w) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = L();
			return r === null ? i?.after(a) : r.before(a), D(a), a;
		}
		dn(r);
	}
	return D(r), r;
}
function cn(e) {
	e.textContent = "";
}
function ln() {
	return !1;
}
function un(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function dn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function fn(e) {
	q === null && (W === null && we(e), Ce()), U && Se(e);
}
function pn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function B(e, t) {
	var n = q;
	n !== null && n.f & 8192 && (e |= S);
	var r = {
		ctx: k,
		deps: null,
		nodes: null,
		f: e | b | 512,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: n,
		b: n && n.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	M?.register_created_effect(r);
	var i = r;
	if (e & 4) At === null ? Pt.ensure().schedule(r) : At.push(r);
	else if (t !== null) {
		try {
			Xn(r);
		} catch (e) {
			throw H(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ne));
	}
	if (i !== null && (i.parent = n, n !== null && pn(i, n), W !== null && W.f & 2 && !(e & 64))) {
		var a = W;
		(a.effects ??= []).push(i);
	}
	return r;
}
function mn() {
	return W !== null && !G;
}
function hn(e) {
	let t = B(8, null);
	return j(t, y), t.teardown = e, t;
}
function gn(e) {
	fn("$effect");
	var t = q.f;
	if (!W && t & 32 && k !== null && !k.i) {
		var n = k;
		(n.e ??= []).push(e);
	} else return _n(e);
}
function _n(e) {
	return B(4 | ie, e);
}
function vn(e) {
	Pt.ensure();
	let t = B(64 | re, e);
	return () => {
		H(t);
	};
}
function yn(e) {
	Pt.ensure();
	let t = B(64 | re, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? An(t, () => {
			H(t), n(void 0);
		}) : (H(t), n(void 0));
	});
}
function bn(e) {
	return B(4, e);
}
function xn(e) {
	return B(ce | re, e);
}
function Sn(e, t = 0) {
	return B(8 | t, e);
}
function Cn(e, t = [], n = [], r = []) {
	dt(r, t, n, (t) => {
		B(8, () => {
			e(...t.map($));
		});
	});
}
function wn(e, t = 0) {
	return B(16 | t, e);
}
function V(e) {
	return B(32 | re, e);
}
function Tn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = U, n = W;
		Ln(!0), K(null);
		try {
			t.call(null);
		} finally {
			Ln(e), K(n);
		}
	}
}
function En(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && at(() => {
			e.abort(ve);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : H(n, t), n = r;
	}
}
function Dn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || H(t), t = n;
	}
}
function H(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (On(e.nodes.start, e.nodes.end), n = !0), e.f |= te, En(e, t && !n), Yn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Tn(e), e.f ^= te, e.f |= ee;
	var i = e.parent;
	i !== null && i.first !== null && kn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function On(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ R(e);
		e.remove(), e = n;
	}
}
function kn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function An(e, t, n = !0) {
	var r = [];
	jn(e, r, !0);
	var i = () => {
		n && H(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function jn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= S;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = (i.f & 65536) != 0 || (i.f & 32) != 0 && (e.f & 16) != 0;
				jn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Mn(e) {
	Nn(e, !0);
}
function Nn(e, t) {
	if (e.f & 8192) {
		e.f ^= S, e.f & 1024 || (j(e, b), Pt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = (n.f & 65536) != 0 || (n.f & 32) != 0;
			Nn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Pn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ R(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Fn = null, In = !1, U = !1;
function Ln(e) {
	U = e;
}
var W = null, G = !1;
function K(e) {
	W = e;
}
var q = null;
function J(e) {
	q = e;
}
var Y = null;
function Rn(e) {
	W !== null && (Y ??= /* @__PURE__ */ new Set()).add(e);
}
var X = null, Z = 0, Q = null;
function zn(e) {
	Q = e;
}
var Bn = 1, Vn = 0, Hn = Vn;
function Un(e) {
	Hn = e;
}
function Wn() {
	return ++Bn;
}
function Gn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~oe), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Gn(a) && St(a), a.wv > e.wv) return !0;
		}
		t & 512 && N === null && j(e, y);
	}
	return !1;
}
function Kn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Y !== null && Y.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Kn(a, t, !1) : t === a && (n ? j(a, b) : a.f & 1024 && j(a, x), Bt(a));
	}
}
function qn(e) {
	var t = X, n = Z, r = Q, i = W, a = Y, o = k, s = G, c = Hn, l = e.f;
	X = null, Z = 0, Q = null, W = l & 96 ? null : e, Y = null, He(e.ctx), G = !1, Hn = ++Vn, e.ac !== null && (at(() => {
		e.ac.abort(ve);
	}), e.ac = null);
	try {
		e.f |= se;
		var u = e.fn, d = u();
		e.f |= C;
		var f = e.deps, p = M?.is_fork;
		if (X !== null) {
			var m;
			if (p || Yn(e, Z), f !== null && Z > 0) for (f.length = Z + X.length, m = 0; m < X.length; m++) f[Z + m] = X[m];
			else e.deps = f = X;
			if (mn() && e.f & 512) for (m = Z; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && Z < f.length && (Yn(e, Z), f.length = Z);
		if (Ge() && Q !== null && !G && f !== null && !(e.f & 6146)) for (m = 0; m < Q.length; m++) Kn(Q[m], e);
		if (i !== null && i !== e) {
			if (Vn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Vn;
			if (t !== null) for (let e of t) e.rv = Vn;
			Q !== null && (r === null ? r = Q : r.push(...Q));
		}
		return e.f & 8388608 && (e.f ^= le), d;
	} catch (e) {
		return Ye(e);
	} finally {
		e.f ^= se, X = t, Z = n, Q = r, W = i, Y = a, He(o), G = s, Hn = c;
	}
}
function Jn(e, n) {
	let r = n.reactions;
	if (r !== null) {
		var o = i.call(r, e);
		if (o !== -1) {
			var s = r.length - 1;
			s === 0 ? r = n.reactions = null : (r[o] = r[s], r.pop());
		}
	}
	if (r === null && n.f & 2 && (X === null || !a.call(X, n))) {
		var c = n;
		c.f & 512 && (c.f ^= 512, c.f &= ~oe), c.v !== t && Qe(c), c.ac !== null && at(() => {
			c.ac.abort(ve), c.ac = null, j(c, b);
		}), Ct(c), Yn(c, 0);
	}
}
function Yn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Jn(e, n[r]);
}
function Xn(e) {
	var t = e.f;
	if (!(t & 16384)) {
		j(e, y);
		var n = q, r = In;
		q = e, In = (t & 96) == 0;
		try {
			t & 16777232 ? Dn(e) : En(e), Tn(e);
			var i = qn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Bn;
		} finally {
			In = r, q = n;
		}
	}
}
async function Zn() {
	await Promise.resolve(), Ft();
}
function $(e) {
	var t = (e.f & 2) != 0;
	if (Fn?.add(e), W !== null && !G && !(q !== null && q.f & 16384) && (Y === null || !Y.has(e))) {
		var n = W.deps;
		if (W.f & 2097152) e.rv < Vn && (e.rv = Vn, X === null && n !== null && n[Z] === e ? Z++ : X === null ? X = [e] : X.push(e));
		else {
			W.deps ??= [], a.call(W.deps, e) || W.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [W] : a.call(r, W) || r.push(W);
		}
	}
	if (U && Wt.has(e)) return Wt.get(e);
	if (t) {
		var i = e;
		if (U) {
			var o = i.v;
			return (!(i.f & 1024) && i.reactions !== null || $n(i)) && (o = xt(i)), Wt.set(i, o), o;
		}
		var s = (i.f & 512) == 0 && !G && W !== null && (In || (W.f & 512) != 0), c = (i.f & C) === 0;
		Gn(i) && (s && (i.f |= 512), St(i)), s && !c && (wt(i), Qn(i));
	}
	if (N?.has(e)) return N.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Qn(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (wt(t), Qn(t));
}
function $n(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Wt.has(t) || t.f & 2 && $n(t)) return !0;
	return !1;
}
function er(e) {
	var t = G;
	try {
		return G = !0, e();
	} finally {
		G = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var tr = Symbol("events"), nr = /* @__PURE__ */ new Set(), rr = /* @__PURE__ */ new Set();
function ir(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || lr.call(t, e), !e.cancelBubble) return at(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? A(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function ar(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = ir(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && hn(() => {
		t.removeEventListener(e, o, a);
	});
}
function or(e, t, n) {
	(t[tr] ??= {})[e] = n;
}
function sr(e) {
	for (var t = 0; t < e.length; t++) nr.add(e[t]);
	for (var n of rr) n(e);
}
var cr = null;
function lr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	cr = e;
	var o = 0, s = cr === e && e[tr];
	if (s) {
		var l = i.indexOf(s);
		if (l !== -1 && (t === document || t === window)) {
			e[tr] = t;
			return;
		}
		var u = i.indexOf(t);
		if (u === -1) return;
		l <= u && (o = l);
	}
	if (a = i[o] || e.target, a !== t) {
		c(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var d = W, f = q;
		K(null), J(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[tr]?.[r];
					h != null && (!a.disabled || e.target === a) && h.call(a, e);
				} catch (e) {
					p ? m.push(e) : p = e;
				}
				if (e.cancelBubble) break;
				o++, a = o < i.length ? i[o] : null;
			}
			if (p) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw p;
			}
		} finally {
			e[tr] = t, delete e.currentTarget, K(d), J(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var ur = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function dr(e) {
	return ur?.createHTML(e) ?? e;
}
function fr(e) {
	var t = un("template");
	return t.innerHTML = dr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function pr(e, t) {
	var n = q;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function mr(e, t) {
	var n = (t & 1) != 0, r = (t & 2) != 0, i, a = !e.startsWith("<!>");
	return () => {
		if (w) return pr(E, null), E;
		i === void 0 && (i = fr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ an(i)));
		var t = r || en ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ an(t), s = t.lastChild;
			pr(o, s);
		} else pr(t, t);
		return t;
	};
}
function hr(e, t) {
	if (w) {
		var n = q;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = E), Fe();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var gr = ["touchstart", "touchmove"];
function _r(e) {
	return gr.includes(e);
}
function vr(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ge] ??= e.nodeValue) && (e[ge] = n, e.nodeValue = `${n}`);
}
function yr(e, t) {
	return Sr(e, t);
}
function br(t, n) {
	rn(), n.intro = n.intro ?? !1;
	let r = n.target, i = w, a = E;
	try {
		for (var o = /* @__PURE__ */ an(r); o && (o.nodeType !== 8 || o.data !== "[");) o = /* @__PURE__ */ R(o);
		if (!o) throw e;
		T(!0), D(o);
		let i = Sr(t, {
			...n,
			anchor: o
		});
		return T(!1), i;
	} catch (i) {
		if (i instanceof Error && i.message.split("\n").some((e) => e.startsWith("https://svelte.dev/e/"))) throw i;
		return i !== e && console.warn("Failed to hydrate: ", i), n.recover === !1 && Ee(), rn(), cn(r), T(!1), yr(t, n);
	} finally {
		T(i), D(a);
	}
}
var xr = /* @__PURE__ */ new Map();
function Sr(t, { target: n, anchor: r, props: i = {}, events: a, context: s, intro: c = !0, transformError: l }) {
	rn();
	var u = void 0, d = yn(() => {
		var c = r ?? n.appendChild(L());
		lt(c, { pending: () => {} }, (n) => {
			Ue({});
			var r = k;
			if (s && (r.c = s), a && (i.$$events = a), w && pr(n, null), u = t(n, i) || {}, w && (q.nodes.end = E, E === null || E.nodeType !== 8 || E.data !== "]")) throw Ne(), e;
			We();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = _r(r);
					for (let e of [n, document]) {
						var a = xr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), xr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, lr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(o(nr)), rr.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = xr.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, lr), t.delete(e), t.size === 0 && xr.delete(r)) : t.set(e, i);
			}
			rr.delete(f), c !== r && c.parentNode?.removeChild(c);
		};
	});
	return Cr.set(u, d), u;
}
var Cr = /* @__PURE__ */ new WeakMap();
function wr(e, t) {
	let n = Cr.get(e);
	return n ? (Cr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Tr = class {
	anchor;
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = !0;
	constructor(e, t = !0) {
		this.anchor = e, this.#i = t;
	}
	#a = (e) => {
		if (this.#e.has(e)) {
			var t = this.#e.get(e), n = this.#t.get(t);
			if (n) Mn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Mn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (H(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Pn(r, t), t.append(L()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else H(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), An(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (H(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = M, r = ln();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = L();
			i.append(a), this.#n.set(e, {
				effect: V(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, V(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else w && (this.anchor = E), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function Er(e, t, n = !1) {
	var r;
	w && (r = E, Fe());
	var i = new Tr(e), a = n ? ne : 0;
	function o(e, t) {
		if (w) {
			var n = Re(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Le();
				D(a), i.anchor = a, T(!1), i.ensure(e, t), T(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	wn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Dr(e, t) {
	return t;
}
function Or(e, t, n) {
	for (var r = [], i = t.length, a, s = t.length, c = 0; c < i; c++) {
		let n = t[c];
		An(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					kr(e, o(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = r.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			cn(d), d.append(u), e.items.clear();
		}
		kr(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function kr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ae, Pn(a, document.createDocumentFragment())) : H(t[i], n);
	}
}
var Ar;
function jr(e, t, n, i, a, s = null) {
	var c = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		c = w ? D(/* @__PURE__ */ an(u)) : u.appendChild(L());
	}
	w && Fe();
	var d = null, f = /* @__PURE__ */ yt(() => {
		var e = n();
		return r(e) ? e : e == null ? [] : o(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Nr(v, p, c, t, i), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ae, Fr(d, null, c)) : Mn(d) : An(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: wn(() => {
			p = $(f);
			var e = p.length;
			let r = !1;
			w && Re(c) === "[!" != (e === 0) && (c = Le(), D(c), T(!1), r = !0);
			for (var o = /* @__PURE__ */ new Set(), u = M, v = ln(), y = 0; y < e; y += 1) {
				w && E.nodeType === 8 && E.data === "]" && (c = E, r = !0, T(!1));
				var b = p[y], x = i(b, y), S = h ? null : l.get(x);
				S ? (S.v && Jt(S.v, b), S.i && Jt(S.i, y), v && u.unskip_effect(S.e)) : (S = Pr(l, h ? c : Ar ??= L(), b, x, y, a, t, n), h || (S.e.f |= ae), l.set(x, S)), o.add(x);
			}
			if (e === 0 && s && !d && (h ? d = V(() => s(c)) : (d = V(() => s(Ar ??= L())), d.f |= ae)), e > o.size && xe("", "", ""), w && e > 0 && D(Le()), !h) if (m.set(u, o), v) {
				for (let [e, t] of l) o.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			r && T(!0), $(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, w && (c = E);
}
function Mr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Nr(e, t, n, r, i) {
	var a = (r & 8) != 0, s = t.length, c = e.items, l = Mr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < s; v += 1) h = t[v], g = i(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = i(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Mn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ae, _ === l) Fr(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Ir(e, d, _), Ir(e, _, y), Fr(_, y, n), d = _, p = [], m = [], l = Mr(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], ee = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Fr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Ir(e, S.prev, ee.next), Ir(e, d, S), Ir(e, ee, b), l = b, d = ee, --v, p = [], m = [];
				} else u.delete(_), Fr(_, l, n), Ir(e, _.prev, _.next), Ir(e, _, d === null ? e.effect.first : d.next), Ir(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Mr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Mr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (kr(e, o(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var C = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || C.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && C.push(l), l = Mr(l.next);
		var te = C.length;
		if (te > 0) {
			var ne = r & 4 && s === 0 ? n : null;
			if (a) {
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.fix();
			}
			Or(e, C, ne);
		}
	}
	a && A(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Pr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Kt(n) : /* @__PURE__ */ qt(n, !1, !1) : null, l = o & 2 ? Kt(i) : null;
	return {
		v: c,
		i: l,
		e: V(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Fr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ R(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Ir(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/css.js
function Lr(e, t) {
	bn(() => {
		var n = e.getRootNode(), r = n.host ? n : n.head ?? n.ownerDocument.head;
		if (!r.querySelector("#" + t.hash)) {
			let e = un("style");
			e.id = t.hash, e.textContent = t.code, r.appendChild(e);
		}
	});
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var Rr = [..." 	\n\r\f\xA0\v﻿"];
function zr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Rr.includes(r[o - 1])) && (s === r.length || Rr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Br(e, t, n, r, i, a) {
	var o = e[me];
	if (w || o !== n || o === void 0) {
		var s = zr(n, r, a);
		(!w || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[me] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Vr = Symbol("is custom element"), Hr = Symbol("is html"), Ur = ye ? "link" : "LINK";
function Wr(e) {
	if (w) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					Gr(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					Gr(e, "checked", null), e.checked = r;
				}
			}
		};
		e[_e] = n, A(n), it();
	}
}
function Gr(e, t, n, r) {
	var i = Kr(e);
	w && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Ur) || i[t] !== (i[t] = n) && (t === "loading" && (e[fe] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Jr(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function Kr(e) {
	return e[pe] ??= {
		[Vr]: e.nodeName.includes("-"),
		[Hr]: e.namespaceURI === n
	};
}
var qr = /* @__PURE__ */ new Map();
function Jr(e) {
	var t = e.getAttribute("is") || e.nodeName, n = qr.get(t);
	if (n) return n;
	qr.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = u(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.push(o);
		i = p(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Yr(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	ot(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Xr(e) ? Zr(a) : a, n(a), M !== null && r.add(M), await Zn(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (w && e.defaultValue !== e.value || er(t) == null && e.value) && (n(Xr(e) ? Zr(e.value) : e.value), M !== null && r.add(M)), Sn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = M;
			if (r.has(i)) return;
		}
		Xr(e) && n === Zr(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function Xr(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Zr(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Qr(e, t) {
	return e === t || e?.[ue] === t;
}
function $r(e = {}, t, n, r) {
	var i = k.r, a = q;
	return bn(() => {
		var o, s;
		return Sn(() => {
			o = s, s = r?.() || [], er(() => {
				Qr(n(...s), e) || (t(e, ...s), o && Qr(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Qr(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function ei(e, t, n, r) {
	var i = !0, a = (n & 8) != 0, o = (n & 16) != 0, s = r, c = !0, u = void 0, d = () => o && i ? (u ??= /* @__PURE__ */ ht(r), $(u)) : (c && (c = !1, s = o ? er(r) : r), s);
	let f;
	if (a) {
		var p = ue in e || de in e;
		f = l(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = nt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && De(t), f(m)));
	var g = i ? () => {
		var n = e[t];
		return n === void 0 ? d() : (c = !0, n);
	} : () => {
		var n = e[t];
		return n !== void 0 && (s = void 0), n === void 0 ? s : n;
	};
	if (i && !(n & 4)) return g;
	if (f) {
		var _ = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!i || !t || _ || h) && f(t ? g() : e), e) : g();
		});
	}
	var v = !1, y = (n & 1 ? ht : yt)(() => (v = !1, g()));
	a && $(y);
	var b = q;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? $(y) : i && a ? Qt(e) : e;
			return I(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return U && v || b.f & 16384 ? y.v : $(y);
	});
}
//#endregion
//#region node_modules/svelte/src/legacy/legacy-client.js
function ti(e) {
	return new ni(e);
}
var ni = class {
	#e;
	#t;
	constructor(e) {
		var t = /* @__PURE__ */ new Map(), n = (e, n) => {
			var r = /* @__PURE__ */ qt(n, !1, !1);
			return t.set(e, r), r;
		};
		let r = new Proxy({
			...e.props || {},
			$$events: {}
		}, {
			get(e, r) {
				return $(t.get(r) ?? n(r, Reflect.get(e, r)));
			},
			has(e, r) {
				return r === de ? !0 : ($(t.get(r) ?? n(r, Reflect.get(e, r))), Reflect.has(e, r));
			},
			set(e, r, i) {
				return I(t.get(r) ?? n(r, i), i), Reflect.set(e, r, i);
			}
		});
		this.#t = (e.hydrate ? br : yr)(e.component, {
			target: e.target,
			anchor: e.anchor,
			props: r,
			context: e.context,
			intro: e.intro ?? !1,
			recover: e.recover,
			transformError: e.transformError
		}), (!e?.props?.$$host || e.sync === !1) && Ft(), this.#e = r.$$events;
		for (let e of Object.keys(this.#t)) e === "$set" || e === "$destroy" || e === "$on" || c(this, e, {
			get() {
				return this.#t[e];
			},
			set(t) {
				this.#t[e] = t;
			},
			enumerable: !0
		});
		this.#t.$set = (e) => {
			Object.assign(r, e);
		}, this.#t.$destroy = () => {
			wr(this.#t);
		};
	}
	$set(e) {
		this.#t.$set(e);
	}
	$on(e, t) {
		this.#e[e] = this.#e[e] || [];
		let n = (...e) => t.call(this, ...e);
		return this.#e[e].push(n), () => {
			this.#e[e] = this.#e[e].filter((e) => e !== n);
		};
	}
	$destroy() {
		this.#t.$destroy();
	}
}, ri;
typeof HTMLElement == "function" && (ri = class extends HTMLElement {
	$$ctor;
	$$s;
	$$c;
	$$cn = !1;
	$$d = {};
	$$r = !1;
	$$p_d = {};
	$$l = {};
	$$l_u = /* @__PURE__ */ new Map();
	$$me;
	$$shadowRoot = null;
	constructor(e, t, n) {
		super(), this.$$ctor = e, this.$$s = t, n && (this.$$shadowRoot = this.attachShadow(n));
	}
	addEventListener(e, t, n) {
		if (this.$$l[e] = this.$$l[e] || [], this.$$l[e].push(t), this.$$c) {
			let n = this.$$c.$on(e, t);
			this.$$l_u.set(t, n);
		}
		super.addEventListener(e, t, n);
	}
	removeEventListener(e, t, n) {
		if (super.removeEventListener(e, t, n), this.$$c) {
			let e = this.$$l_u.get(t);
			e && (e(), this.$$l_u.delete(t));
		}
	}
	async connectedCallback() {
		if (this.$$cn = !0, !this.$$c) {
			if (await Promise.resolve(), !this.$$cn || this.$$c) return;
			function e(e) {
				return (t) => {
					let n = un("slot");
					e !== "default" && (n.name = e), hr(t, n);
				};
			}
			let t = {}, n = ai(this);
			for (let r of this.$$s) r in n && (r === "default" && !this.$$d.children ? (this.$$d.children = e(r), t.default = !0) : t[r] = e(r));
			for (let e of this.attributes) {
				let t = this.$$g_p(e.name);
				t in this.$$d || (this.$$d[t] = ii(t, e.value, this.$$p_d, "toProp"));
			}
			for (let e in this.$$p_d) !(e in this.$$d) && this[e] !== void 0 && (this.$$d[e] = this[e], delete this[e]);
			this.$$c = ti({
				component: this.$$ctor,
				target: this.$$shadowRoot || this,
				props: {
					...this.$$d,
					$$slots: t,
					$$host: this
				}
			}), this.$$me = vn(() => {
				Sn(() => {
					this.$$r = !0;
					for (let e of s(this.$$c)) {
						if (!this.$$p_d[e]?.reflect) continue;
						this.$$d[e] = this.$$c[e];
						let t = ii(e, this.$$d[e], this.$$p_d, "toAttribute");
						t == null ? this.removeAttribute(this.$$p_d[e].attribute || e) : this.setAttribute(this.$$p_d[e].attribute || e, t);
					}
					this.$$r = !1;
				});
			});
			for (let e in this.$$l) for (let t of this.$$l[e]) {
				let n = this.$$c.$on(e, t);
				this.$$l_u.set(t, n);
			}
			this.$$l = {};
		}
	}
	attributeChangedCallback(e, t, n) {
		this.$$r || (e = this.$$g_p(e), this.$$d[e] = ii(e, n, this.$$p_d, "toProp"), this.$$c?.$set({ [e]: this.$$d[e] }));
	}
	disconnectedCallback() {
		this.$$cn = !1, Promise.resolve().then(() => {
			!this.$$cn && this.$$c && (this.$$c.$destroy(), this.$$me(), this.$$c = void 0);
		});
	}
	$$g_p(e) {
		return s(this.$$p_d).find((t) => this.$$p_d[t].attribute === e || !this.$$p_d[t].attribute && t.toLowerCase() === e) || e;
	}
});
function ii(e, t, n, r) {
	let i = n[e]?.type;
	if (t = i === "Boolean" && typeof t != "boolean" ? t != null : t, !r || !n[e]) return t;
	if (r === "toAttribute") switch (i) {
		case "Object":
		case "Array": return t == null ? null : JSON.stringify(t);
		case "Boolean": return t ? "" : null;
		case "Number": return t ?? null;
		default: return t;
	}
	else switch (i) {
		case "Object":
		case "Array": return t && JSON.parse(t);
		case "Boolean": return t;
		case "Number": return t == null ? t : +t;
		default: return t;
	}
}
function ai(e) {
	let t = {};
	return e.childNodes.forEach((e) => {
		t[e.slot || "default"] = !0;
	}), t;
}
function oi(e, t, n, r, i, a) {
	let o = class extends ri {
		constructor() {
			super(e, n, i), this.$$p_d = t;
		}
		static get observedAttributes() {
			return s(t).map((e) => (t[e].attribute || e).toLowerCase());
		}
	};
	return s(t).forEach((e) => {
		c(o.prototype, e, {
			get() {
				return this.$$c && e in this.$$c ? this.$$c[e] : this.$$d[e];
			},
			set(n) {
				n = ii(e, n, t), this.$$d[e] = n;
				var r = this.$$c;
				r && (l(r, e)?.get ? r[e] = n : r.$set({ [e]: n }));
			}
		});
	}), r.forEach((e) => {
		c(o.prototype, e, { get() {
			return this.$$c?.[e];
		} });
	}), a && (o = a(o)), e.element = o, o;
}
//#endregion
//#region src/Cmdk.svelte
var si = /* @__PURE__ */ mr("<small class=\"svelte-jgcga6\"> </small>"), ci = /* @__PURE__ */ mr("<li role=\"presentation\"><button type=\"button\" role=\"option\"><span> </span> <!></button></li>"), li = /* @__PURE__ */ mr("<li class=\"cmdk-group-label svelte-jgcga6\" role=\"separator\"> </li> <!>", 1), ui = /* @__PURE__ */ mr("<li class=\"cmdk-empty svelte-jgcga6\" role=\"option\" aria-selected=\"false\">No matches.</li>"), di = /* @__PURE__ */ mr("<dialog class=\"cmdk svelte-jgcga6\" aria-label=\"Command palette\"><input class=\"cmdk-input svelte-jgcga6\" type=\"text\" autocomplete=\"off\" spellcheck=\"false\" aria-label=\"Command palette search\" role=\"combobox\" aria-expanded=\"true\" aria-controls=\"cmdk-list\"/> <ul id=\"cmdk-list\" class=\"cmdk-list svelte-jgcga6\" role=\"listbox\" aria-label=\"Results\"><!> <!> <!></ul> <p class=\"cmdk-hint svelte-jgcga6\">Up/Down to move · Enter to run · Esc to close</p></dialog>"), fi = {
	hash: "svelte-jgcga6",
	code: "\n	@keyframes svelte-jgcga6-cmdk-in { from { opacity: 0; transform: scale(0.96) translateY(-6px); } to { opacity: 1; transform: scale(1) translateY(0); } }.cmdk.svelte-jgcga6 { animation: svelte-jgcga6-cmdk-in 0.15s ease-out;width:min(520px, 92vw);max-width:92vw;padding:0;border:1px solid var(--cmdk-border, #d0cac1);border-radius:var(--cmdk-radius, 8px);background:var(--cmdk-surface, #fff);color:var(--cmdk-text, #21322b);box-shadow:0 12px 40px rgba(0,0,0,0.3);margin:12vh auto auto;}.cmdk.svelte-jgcga6::backdrop {background:rgba(0,0,0,0.45);}.cmdk-input.svelte-jgcga6 {width:100%;box-sizing:border-box;border:0;border-bottom:1px solid var(--cmdk-border, #e2ddd5);background:transparent;color:inherit;font:inherit;font-size:15px;padding:14px 16px;outline:none;}.cmdk-list.svelte-jgcga6 {list-style:none;margin:0;padding:6px;max-height:46vh;overflow-y:auto;}.cmdk-item.svelte-jgcga6 {display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:8px 10px;border-radius:var(--cmdk-radius-sm, 6px);cursor:pointer;width:100%;border:0;background:transparent;color:inherit;font:inherit;font-size:14px;text-align:left;}.cmdk-item.is-active.svelte-jgcga6 {background:var(--cmdk-selected-bg, #d7efe7);}.cmdk-item.svelte-jgcga6 small:where(.svelte-jgcga6) {color:var(--cmdk-text-muted, #63746a);font-size:11px;white-space:nowrap;}.cmdk-group-label.svelte-jgcga6 {padding:8px 10px 4px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:var(--cmdk-text-muted, #63746a);}.cmdk-empty.svelte-jgcga6 {padding:12px 10px;color:var(--cmdk-text-muted, #63746a);font-size:13px;}.cmdk-hint.svelte-jgcga6 {margin:0;padding:8px 16px;border-top:1px solid var(--cmdk-border, #e2ddd5);color:var(--cmdk-text-muted, #63746a);font-size:11px;}"
};
function pi(e, t) {
	Ue(t, !0), Lr(e, fi);
	let n = ei(t, "items", 7, "[]"), r = ei(t, "placeholder", 7, "Search…"), i = /* @__PURE__ */ vt(() => typeof n() == "string" ? JSON.parse(n()) : n()), a, o, s = /* @__PURE__ */ F(""), c = /* @__PURE__ */ F(0);
	function l(e, t) {
		if (!e) return !0;
		let n = e.toLowerCase(), r = t.toLowerCase(), i = 0;
		for (let e = 0; e < r.length && i < n.length; e++) r[e] === n[i] && i++;
		return i === n.length;
	}
	function u(e, t) {
		if (l(t, e.label) || e.hint && l(t, e.hint)) return !0;
		if (e.keywords) {
			for (let n of e.keywords) if (l(t, n)) return !0;
		}
		return !1;
	}
	let d = /* @__PURE__ */ vt(() => {
		let e = $(s).trim().toLowerCase();
		return (e ? $(i).filter((t) => u(t, e)) : $(i)).slice(0, 40);
	});
	gn(() => {
		$(d), I(c, 0);
	});
	function f() {
		!a || a.open || (I(s, ""), I(c, 0), typeof a.showModal == "function" && a.showModal(), o?.focus());
	}
	function p(e) {
		let t = $(d).length;
		e.key === "ArrowDown" && t ? (e.preventDefault(), I(c, ($(c) + 1) % t), m()) : e.key === "ArrowUp" && t ? (e.preventDefault(), I(c, ($(c) - 1 + t) % t), m()) : e.key === "Enter" && (e.preventDefault(), $(d)[$(c)]?.onSelect?.(), a?.close(), dispatchEvent(new CustomEvent("close")));
	}
	function m() {
		setTimeout(() => a?.querySelector(".cmdk-item.is-active")?.scrollIntoView({ block: "nearest" }), 0);
	}
	function h(e) {
		$(d)[e]?.onSelect?.(), a?.close(), dispatchEvent(new CustomEvent("close"));
	}
	let g = /* @__PURE__ */ vt(() => {
		let e = $(d).filter((e) => !e.group), t = /* @__PURE__ */ new Map();
		for (let e of $(d)) e.group && (t.has(e.group) || t.set(e.group, []), t.get(e.group).push(e));
		return {
			noGroup: e,
			groups: [...t.entries()]
		};
	});
	var _ = {
		open: f,
		get items() {
			return n();
		},
		set items(e = "[]") {
			n(e), Ft();
		},
		get placeholder() {
			return r();
		},
		set placeholder(e = "Search…") {
			r(e), Ft();
		}
	}, y = di(), b = z(y);
	Wr(b), $r(b, (e) => o = e, () => o);
	var x = sn(b, 2), S = z(x);
	jr(S, 19, () => $(g).noGroup, (e) => e.id, (e, t, n) => {
		var r = ci(), i = z(r);
		let a;
		var o = z(i), s = z(o, !0);
		O(o);
		var l = sn(o, 2), u = (e) => {
			var n = si(), r = z(n, !0);
			O(n), Cn(() => vr(r, $(t).hint)), hr(e, n);
		};
		Er(l, (e) => {
			$(t).hint && e(u);
		}), O(i), O(r), Cn(() => {
			a = Br(i, 1, "cmdk-item svelte-jgcga6", null, a, { "is-active": $(c) === $(n) }), Gr(i, "aria-selected", $(c) === $(n)), vr(s, $(t).label);
		}), or("click", i, () => h($(n))), hr(e, r);
	});
	var ee = sn(S, 2);
	jr(ee, 17, () => $(g).groups, Dr, (e, t) => {
		var n = /* @__PURE__ */ vt(() => v($(t), 2));
		let r = () => $(n)[0], i = () => $(n)[1];
		var a = li(), o = on(a), s = z(o, !0);
		O(o), jr(sn(o, 2), 19, i, (e) => e.id, (e, t, n) => {
			let a = /* @__PURE__ */ vt(() => $(g).noGroup.length + [...$(g).groups].slice(0, $(g).groups.indexOf([r(), i()])).reduce((e, [, t]) => e + t.length, 0) + $(n));
			var o = ci(), s = z(o);
			let l;
			var u = z(s), d = z(u, !0);
			O(u);
			var f = sn(u, 2), p = (e) => {
				var n = si(), r = z(n, !0);
				O(n), Cn(() => vr(r, $(t).hint)), hr(e, n);
			};
			Er(f, (e) => {
				$(t).hint && e(p);
			}), O(s), O(o), Cn(() => {
				l = Br(s, 1, "cmdk-item svelte-jgcga6", null, l, { "is-active": $(c) === $(a) }), Gr(s, "aria-selected", $(c) === $(a)), vr(d, $(t).label);
			}), or("click", s, () => h($(a))), hr(e, o);
		}), Cn(() => vr(s, r())), hr(e, a);
	});
	var C = sn(ee, 2), te = (e) => {
		hr(e, ui());
	};
	return Er(C, (e) => {
		$(d).length === 0 && e(te);
	}), O(x), Ie(2), O(y), $r(y, (e) => a = e, () => a), Cn(() => Gr(b, "placeholder", r())), ar("close", y, () => dispatchEvent(new CustomEvent("close"))), or("keydown", y, (e) => e.key === "Escape" && dispatchEvent(new CustomEvent("close"))), or("keydown", b, p), Yr(b, () => $(s), (e) => I(s, e)), hr(e, y), We(_);
}
sr(["keydown", "click"]), customElements.define("worn-cmdk", oi(pi, {
	items: { type: "Array" },
	placeholder: {}
}, [], ["open"]));
//#endregion
export { pi as default };
