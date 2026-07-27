//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region node_modules/svelte/src/constants.js
var e = {}, t = Symbol("uninitialized"), n = Array.isArray, r = Array.prototype.indexOf, i = Array.prototype.includes, a = Array.from, o = Object.keys, s = Object.defineProperty, c = Object.getOwnPropertyDescriptor, l = Object.prototype, u = Array.prototype, d = Object.getPrototypeOf, f = Object.isExtensible, p = () => {};
function m(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function h() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var g = 1024, _ = 2048, v = 4096, y = 8192, ee = 16384, te = 32768, ne = 1 << 25, re = 65536, ie = 1 << 19, ae = 1 << 20, oe = 65536, se = 1 << 21, ce = 1 << 22, le = 1 << 23, ue = Symbol("$state"), de = Symbol("legacy props"), fe = Symbol("attributes"), pe = Symbol("class"), me = Symbol("style"), he = Symbol("text"), ge = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
globalThis.document?.contentType;
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function _e() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function ve() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function ye() {
	throw Error("https://svelte.dev/e/hydration_failed");
}
function be(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function xe() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Se() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ce() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function we() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
function Te() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Ee(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function De() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var b = !1;
function Oe(e) {
	b = e;
}
var x;
function S(t) {
	if (t === null) throw Ee(), e;
	return x = t;
}
function ke() {
	return S(/* @__PURE__ */ I(x));
}
function Ae(t) {
	if (b) {
		if (/* @__PURE__ */ I(x) !== null) throw Ee(), e;
		x = t;
	}
}
function je(e = 1) {
	if (b) {
		for (var t = e, n = x; t--;) n = /* @__PURE__ */ I(n);
		x = n;
	}
}
function Me(e = !0) {
	for (var t = 0, n = x;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ I(n);
		e && n.remove(), n = i;
	}
}
function Ne(t) {
	if (!t || t.nodeType !== 8) throw Ee(), e;
	return t.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Pe(e) {
	return e === this.v;
}
function Fe(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Ie(e) {
	return !Fe(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var C = null;
function Le(e) {
	C = e;
}
function Re(e, t = !1, n) {
	C = {
		p: C,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: W,
		l: null
	};
}
function ze(e) {
	var t = C, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) nn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, C = t.p, e ?? {};
}
function Be() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var w = [];
function Ve() {
	var e = w;
	w = [], m(e);
}
function T(e) {
	if (w.length === 0 && !vt) {
		var t = w;
		queueMicrotask(() => {
			t === w && Ve();
		});
	}
	w.push(e);
}
function He() {
	for (; w.length > 0;) Ve();
}
function Ue(e) {
	var t = W;
	if (t === null) return V.f |= le, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	E(e, t);
}
function E(e, t) {
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
var We = ~(_ | v | g);
function D(e, t) {
	e.f = e.f & We | t;
}
function Ge(e) {
	e.f & 512 || e.deps === null ? D(e, g) : D(e, v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function Ke(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= oe, Ke(t.deps));
}
function qe(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), Ke(e.deps), D(e, g);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var Je = !1;
function Ye(e) {
	var t = Je;
	try {
		return Je = !1, [e(), Je];
	} finally {
		Je = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function Xe(e) {
	var t = V, n = W;
	U(null), G(null);
	try {
		return e();
	} finally {
		U(t), G(n);
	}
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Ze(e) {
	let t = 0, n = Pt(0), r;
	return () => {
		en() && (Q(n), cn(() => (t === 0 && (r = Ln(() => e(() => Rt(n)))), t += 1, () => {
			T(() => {
				--t, t === 0 && (r?.(), r = void 0, Rt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Qe = re | ie;
function $e(e, t, n, r) {
	new et(e, t, n, r);
}
var et = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = b ? x : null;
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
	#h = Ze(() => (this.#m = Pt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = W;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = W.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = un(() => {
			if (b) {
				let e = this.#t;
				ke();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, Qe), b && (this.#e = x);
	}
	#g() {
		try {
			this.#a = R(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		T(r), t && (this.#s = R(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				De();
				return;
			}
			t = !0, n && we(), this.#s !== null && gn(this.#s, () => {
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
					E(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = R(() => e(this.#e)), T(() => {
			var e = this.#c = document.createDocumentFragment(), t = F();
			e.append(t), this.#a = this.#S(() => R(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, gn(this.#o, () => {
				this.#o = null;
			}), this.#x(O));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = R(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				bn(this.#a, e);
				let t = this.#n.pending;
				this.#o = R(() => t(this.#e));
			} else this.#x(O);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		qe(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = W, n = V, r = C;
		G(this.#i), U(this.#i), Le(this.#i.ctx);
		try {
			return wt.ensure(), e();
		} catch (e) {
			return Ue(e), null;
		} finally {
			G(t), U(n), Le(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && gn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, T(() => {
			this.#d = !1, this.#m && It(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Q(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		O?.is_fork ? (this.#a && O.skip_effect(this.#a), this.#o && O.skip_effect(this.#o), this.#s && O.skip_effect(this.#s), O.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (z(this.#a), null), this.#o &&= (z(this.#o), null), this.#s &&= (z(this.#s), null), b && (S(this.#t), je(), S(Me()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return R(() => {
						var r = W;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return E(e, this.#i.parent), null;
				}
			}));
		};
		T(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				E(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => E(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function tt(e, t, n, r) {
	let i = Be() ? at : lt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = W, c = nt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				E(e, s);
			}
			rt();
		}
	}
	var d = it();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ st(e))).then(u).catch((e) => E(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), rt();
	}) : f();
}
function nt() {
	var e = W, t = V, n = C, r = O;
	return function(i = !0) {
		G(e), U(t), Le(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function rt(e = !0) {
	G(null), U(null), Le(null), e && O?.deactivate();
}
function it() {
	var e = W, t = e.b, n = O, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function at(e) {
	var n = 2 | _;
	return W !== null && (W.f |= ie), {
		ctx: C,
		deps: null,
		effects: null,
		equals: Pe,
		f: n,
		fn: e,
		reactions: null,
		rv: 0,
		v: t,
		wv: 0,
		parent: W,
		ac: null
	};
}
var ot = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function st(e, n, r) {
	let i = W;
	i === null && _e();
	var a = void 0, o = Pt(t), s = !V, c = /* @__PURE__ */ new Set();
	return sn(() => {
		var t = W, n = h();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ge && n.reject(e);
			}).finally(rt);
		} catch (e) {
			n.reject(e), rt();
		}
		var r = O;
		if (s) {
			if (t.f & 32768) var l = it();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(ot);
			else for (let e of c.values()) e.reject(ot);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== ot && (r.activate(), t ? (o.f |= le, It(o, t)) : (o.f & 8388608 && (o.f ^= le), It(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), tn(() => {
		for (let e of c) e.reject(ot);
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
function ct(e) {
	let t = /* @__PURE__ */ at(e);
	return wn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function lt(e) {
	let t = /* @__PURE__ */ at(e);
	return t.equals = Ie, t;
}
function ut(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) z(t[n]);
	}
}
function dt(e) {
	var n, r = W, i = e.parent;
	if (!B && i !== null && e.v !== t && i.f & 24576) return Te(), e.v;
	G(i);
	try {
		e.f &= ~oe, ut(e), n = jn(e);
	} finally {
		G(r);
	}
	return n;
}
function ft(e) {
	var t = dt(e);
	if (!e.equals(t) && (e.wv = On(), (!O?.is_fork || e.deps === null) && (O === null ? e.v = t : (O.capture(e, t, !0), gt?.capture(e, t, !0)), e.deps === null))) {
		D(e, g);
		return;
	}
	B || (k === null ? Ge(e) : (en() || O?.is_fork) && k.set(e, t));
}
function pt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && Xe(() => {
		t.ac.abort(ge), t.ac = null;
	}), t.fn !== null && (t.teardown = p), Nn(t, 0), fn(t));
}
function mt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Pn(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var ht = null, O = null, gt = null, k = null, _t = null, vt = !1, yt = !1, bt = null, xt = null, St = 0, Ct = 1, wt = class e {
	id = Ct++;
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
		ht === null ? ht = this : (ht.#n = this, this.#t = ht), ht = this;
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
			for (var r of n.d) D(r, _), t(r);
			for (r of n.m) D(r, v), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, St++ > 1e3 && (this.#x(), Tt());
		for (let e of this.#u) this.#d.delete(e), D(e, _), this.schedule(e);
		for (let e of this.#d) D(e, v), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = bt = [], r = [], i = xt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw jt(e), this.#h() || this.discard(), t;
		}
		if (O = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (bt = null, xt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) At(e, t);
			i.length > 0 && O.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), gt = this, Et(r), Et(n), gt = null, this.#s?.resolve();
		var s = O;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) if (s !== null) {
			let e = s;
			e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
		} else s = this;
		s !== null && s.#g();
	}
	#_(e, t, n) {
		e.f ^= g;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = (i & 96) != 0;
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= g : i & 4 ? t.push(r) : kn(r) && (i & 16 && this.#d.add(r), Pn(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), D(i, _), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), O = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) qe(e[t], this.#u, this.#d);
	}
	capture(e, n, r = !1) {
		e.v !== t && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [n, r]), k?.set(e, n)), this.is_fork || (e.v = n);
	}
	activate() {
		O = this;
	}
	deactivate() {
		O = null, k = null;
	}
	flush() {
		try {
			yt = !0, O = this, this.#g();
		} finally {
			St = 0, _t = null, bt = null, xt = null, yt = !1, O = null, k = null, M.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(ot);
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
		this.#m || (this.#m = !0, T(() => {
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
		return (this.#s ??= h()).promise;
	}
	static ensure() {
		if (O === null) {
			let t = O = new e();
			!yt && !vt && T(() => {
				t.#e || t.flush();
			});
		}
		return O;
	}
	apply() {
		k = null;
	}
	schedule(e) {
		if (_t = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (bt !== null && t === W && (V === null || !(V.f & 2))) return;
			if (n & 96) {
				if (!(n & 1024)) return;
				t.f ^= g;
			}
		}
		this.#c.push(t);
	}
	#x() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? ht = e : t.#t = e, this.linked = !1;
		}
	}
};
function A(e) {
	var t = vt;
	vt = !0;
	try {
		var n;
		for (e && (O !== null && !O.is_fork && O.flush(), n = e());;) {
			if (He(), O === null) return n;
			O.flush();
		}
	} finally {
		vt = t;
	}
}
function Tt() {
	try {
		ve();
	} catch (e) {
		E(e, _t);
	}
}
var j = null;
function Et(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && kn(r) && (j = /* @__PURE__ */ new Set(), Pn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && hn(r), j?.size > 0)) {
				M.clear();
				for (let e of j) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) j.has(n) && (j.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Pn(n);
					}
				}
				j.clear();
			}
		}
		j = null;
	}
}
function Dt(e, t, n, r) {
	if (!n.has(e) && (n.add(e), e.reactions !== null)) for (let i of e.reactions) {
		let e = i.f;
		e & 2 ? Dt(i, t, n, r) : e & 4194320 && !(e & 2048) && Ot(i, t, r) && (D(i, _), kt(i));
	}
}
function Ot(e, t, n) {
	let r = n.get(e);
	if (r !== void 0) return r;
	if (e.deps !== null) for (let r of e.deps) {
		if (i.call(t, r)) return !0;
		if (r.f & 2 && Ot(r, t, n)) return n.set(r, !0), !0;
	}
	return n.set(e, !1), !1;
}
function kt(e) {
	O.schedule(e);
}
function At(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), D(e, g);
		for (var n = e.first; n !== null;) At(n, t), n = n.next;
	}
}
function jt(e) {
	D(e, g);
	for (var t = e.first; t !== null;) jt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Mt = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Map(), Nt = !1;
function Pt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Pe,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t) {
	let n = Pt(e, t);
	return wn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Ft(e, t = !1, n = !0) {
	let r = Pt(e);
	return t || (r.equals = Ie), r;
}
function P(e, t, n = !1) {
	return V !== null && (!H || V.f & 131072) && Be() && V.f & 4325394 && (K === null || !K.has(e)) && Ce(), It(e, n ? Bt(t) : t, xt);
}
function It(e, t, n = null) {
	if (!e.equals(t)) {
		M.set(e, B ? t : e.v);
		var r = wt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && dt(t), k === null && Ge(t);
		}
		e.wv = On(), zt(e, _, n), Be() && W !== null && W.f & 1024 && !(W.f & 96) && (Y === null ? Tn([e]) : Y.push(e)), !r.is_fork && Mt.size > 0 && !Nt && Lt();
	}
	return t;
}
function Lt() {
	Nt = !1;
	for (let e of Mt) {
		e.f & 1024 && D(e, v);
		let t;
		try {
			t = kn(e);
		} catch {
			t = !0;
		}
		t && Pn(e);
	}
	Mt.clear();
}
function Rt(e) {
	P(e, e.v + 1);
}
function zt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Be(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === W)) {
			var l = (c & _) === 0;
			if (l && D(s, t), c & 131072) Mt.add(s);
			else if (c & 2) {
				var u = s;
				k?.delete(u), c & 65536 || (c & 512 && (W === null || !(W.f & 2097152)) && (s.f |= oe), zt(u, v, n));
			} else if (l) {
				var d = s;
				c & 16 && j !== null && j.add(d), n === null ? kt(d) : n.push(d);
			}
		}
	}
}
function Bt(e) {
	if (typeof e != "object" || !e || ue in e) return e;
	let r = d(e);
	if (r !== l && r !== u) return e;
	var i = /* @__PURE__ */ new Map(), a = n(e), o = /* @__PURE__ */ N(0), s = null, f = Z, p = (e) => {
		if (Z === f) return e();
		var t = V, n = Z;
		U(null), Dn(f);
		var r = e();
		return U(t), Dn(n), r;
	};
	return a && i.set("length", /* @__PURE__ */ N(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && xe();
			var r = i.get(t);
			return r === void 0 ? p(() => {
				var e = /* @__PURE__ */ N(n.value, s);
				return i.set(t, e), e;
			}) : P(r, n.value, !0), !0;
		},
		deleteProperty(e, n) {
			var r = i.get(n);
			if (r === void 0) {
				if (n in e) {
					let e = p(() => /* @__PURE__ */ N(t, s));
					i.set(n, e), Rt(o);
				}
			} else P(r, t), Rt(o);
			return !0;
		},
		get(n, r, a) {
			if (r === ue) return e;
			var o = i.get(r), l = r in n;
			if (o === void 0 && (!l || c(n, r)?.writable) && (o = p(() => /* @__PURE__ */ N(Bt(l ? n[r] : t), s)), i.set(r, o)), o !== void 0) {
				var u = Q(o);
				return u === t ? void 0 : u;
			}
			return Reflect.get(n, r, a);
		},
		getOwnPropertyDescriptor(e, n) {
			var r = Reflect.getOwnPropertyDescriptor(e, n);
			if (r && "value" in r) {
				var a = i.get(n);
				a && (r.value = Q(a));
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
			return (r !== void 0 || W !== null && (!a || c(e, n)?.writable)) && (r === void 0 && (r = p(() => /* @__PURE__ */ N(a ? Bt(e[n]) : t, s)), i.set(n, r)), Q(r) === t) ? !1 : a;
		},
		set(e, n, r, l) {
			var u = i.get(n), d = n in e;
			if (a && n === "length") for (var f = r; f < u.v; f += 1) {
				var m = i.get(f + "");
				m === void 0 ? f in e && (m = p(() => /* @__PURE__ */ N(t, s)), i.set(f + "", m)) : P(m, t);
			}
			if (u === void 0) (!d || c(e, n)?.writable) && (u = p(() => /* @__PURE__ */ N(void 0, s)), P(u, Bt(r)), i.set(n, u));
			else {
				d = u.v !== t;
				var h = p(() => Bt(r));
				P(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, n);
			if (g?.set && g.set.call(l, r), !d) {
				if (a && typeof n == "string") {
					var _ = i.get("length"), v = Number(n);
					Number.isInteger(v) && v >= _.v && P(_, v + 1);
				}
				Rt(o);
			}
			return !0;
		},
		ownKeys(e) {
			Q(o);
			var n = Reflect.ownKeys(e).filter((e) => {
				var n = i.get(e);
				return n === void 0 || n.v !== t;
			});
			for (var [r, a] of i) a.v !== t && !(r in e) && n.push(r);
			return n;
		},
		setPrototypeOf() {
			Se();
		}
	});
}
var Vt, Ht, Ut, Wt;
function Gt() {
	if (Vt === void 0) {
		Vt = window, Ht = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Ut = c(t, "firstChild").get, Wt = c(t, "nextSibling").get, f(e) && (e[pe] = void 0, e[fe] = null, e[me] = void 0, e.__e = void 0), f(n) && (n[he] = void 0);
	}
}
function F(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Kt(e) {
	return Ut.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function I(e) {
	return Wt.call(e);
}
function qt(e, t) {
	if (!b) return /* @__PURE__ */ Kt(e);
	var n = /* @__PURE__ */ Kt(x);
	if (n === null) n = x.appendChild(F());
	else if (t && n.nodeType !== 3) {
		var r = F();
		return n?.before(r), S(r), r;
	}
	return t && Qt(n), S(n), n;
}
function Jt(e, t = 1, n = !1) {
	let r = b ? x : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ I(r);
	if (!b) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = F();
			return r === null ? i?.after(a) : r.before(a), S(a), a;
		}
		Qt(r);
	}
	return S(r), r;
}
function Yt(e) {
	e.textContent = "";
}
function Xt() {
	return !1;
}
function Zt(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function Qt(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function $t(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function L(e, t) {
	var n = W;
	n !== null && n.f & 8192 && (e |= y);
	var r = {
		ctx: C,
		deps: null,
		nodes: null,
		f: e | _ | 512,
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
	O?.register_created_effect(r);
	var i = r;
	if (e & 4) bt === null ? wt.ensure().schedule(r) : bt.push(r);
	else if (t !== null) {
		try {
			Pn(r);
		} catch (e) {
			throw z(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= re));
	}
	if (i !== null && (i.parent = n, n !== null && $t(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function en() {
	return V !== null && !H;
}
function tn(e) {
	let t = L(8, null);
	return D(t, g), t.teardown = e, t;
}
function nn(e) {
	return L(4 | ae, e);
}
function rn(e) {
	wt.ensure();
	let t = L(64 | ie, e);
	return () => {
		z(t);
	};
}
function an(e) {
	wt.ensure();
	let t = L(64 | ie, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? gn(t, () => {
			z(t), n(void 0);
		}) : (z(t), n(void 0));
	});
}
function on(e) {
	return L(4, e);
}
function sn(e) {
	return L(ce | ie, e);
}
function cn(e, t = 0) {
	return L(8 | t, e);
}
function ln(e, t = [], n = [], r = []) {
	tt(r, t, n, (t) => {
		L(8, () => {
			e(...t.map(Q));
		});
	});
}
function un(e, t = 0) {
	return L(16 | t, e);
}
function R(e) {
	return L(32 | ie, e);
}
function dn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = B, n = V;
		Cn(!0), U(null);
		try {
			t.call(null);
		} finally {
			Cn(e), U(n);
		}
	}
}
function fn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && Xe(() => {
			e.abort(ge);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : z(n, t), n = r;
	}
}
function pn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || z(t), t = n;
	}
}
function z(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (mn(e.nodes.start, e.nodes.end), n = !0), e.f |= ne, fn(e, t && !n), Nn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	dn(e), e.f ^= ne, e.f |= ee;
	var i = e.parent;
	i !== null && i.first !== null && hn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function mn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ I(e);
		e.remove(), e = n;
	}
}
function hn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function gn(e, t, n = !0) {
	var r = [];
	_n(e, r, !0);
	var i = () => {
		n && z(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function _n(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= y;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = (i.f & 65536) != 0 || (i.f & 32) != 0 && (e.f & 16) != 0;
				_n(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function vn(e) {
	yn(e, !0);
}
function yn(e, t) {
	if (e.f & 8192) {
		e.f ^= y, e.f & 1024 || (D(e, _), wt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = (n.f & 65536) != 0 || (n.f & 32) != 0;
			yn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function bn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ I(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var xn = null, Sn = !1, B = !1;
function Cn(e) {
	B = e;
}
var V = null, H = !1;
function U(e) {
	V = e;
}
var W = null;
function G(e) {
	W = e;
}
var K = null;
function wn(e) {
	V !== null && (K ??= /* @__PURE__ */ new Set()).add(e);
}
var q = null, J = 0, Y = null;
function Tn(e) {
	Y = e;
}
var En = 1, X = 0, Z = X;
function Dn(e) {
	Z = e;
}
function On() {
	return ++En;
}
function kn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~oe), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (kn(a) && ft(a), a.wv > e.wv) return !0;
		}
		t & 512 && k === null && D(e, g);
	}
	return !1;
}
function An(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(K !== null && K.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? An(a, t, !1) : t === a && (n ? D(a, _) : a.f & 1024 && D(a, v), kt(a));
	}
}
function jn(e) {
	var t = q, n = J, r = Y, i = V, a = K, o = C, s = H, c = Z, l = e.f;
	q = null, J = 0, Y = null, V = l & 96 ? null : e, K = null, Le(e.ctx), H = !1, Z = ++X, e.ac !== null && (Xe(() => {
		e.ac.abort(ge);
	}), e.ac = null);
	try {
		e.f |= se;
		var u = e.fn, d = u();
		e.f |= te;
		var f = e.deps, p = O?.is_fork;
		if (q !== null) {
			var m;
			if (p || Nn(e, J), f !== null && J > 0) for (f.length = J + q.length, m = 0; m < q.length; m++) f[J + m] = q[m];
			else e.deps = f = q;
			if (en() && e.f & 512) for (m = J; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && J < f.length && (Nn(e, J), f.length = J);
		if (Be() && Y !== null && !H && f !== null && !(e.f & 6146)) for (m = 0; m < Y.length; m++) An(Y[m], e);
		if (i !== null && i !== e) {
			if (X++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = X;
			if (t !== null) for (let e of t) e.rv = X;
			Y !== null && (r === null ? r = Y : r.push(...Y));
		}
		return e.f & 8388608 && (e.f ^= le), d;
	} catch (e) {
		return Ue(e);
	} finally {
		e.f ^= se, q = t, J = n, Y = r, V = i, K = a, Le(o), H = s, Z = c;
	}
}
function Mn(e, n) {
	let a = n.reactions;
	if (a !== null) {
		var o = r.call(a, e);
		if (o !== -1) {
			var s = a.length - 1;
			s === 0 ? a = n.reactions = null : (a[o] = a[s], a.pop());
		}
	}
	if (a === null && n.f & 2 && (q === null || !i.call(q, n))) {
		var c = n;
		c.f & 512 && (c.f ^= 512, c.f &= ~oe), c.v !== t && Ge(c), c.ac !== null && Xe(() => {
			c.ac.abort(ge), c.ac = null, D(c, _);
		}), pt(c), Nn(c, 0);
	}
}
function Nn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Mn(e, n[r]);
}
function Pn(e) {
	var t = e.f;
	if (!(t & 16384)) {
		D(e, g);
		var n = W, r = Sn;
		W = e, Sn = (t & 96) == 0;
		try {
			t & 16777232 ? pn(e) : fn(e), dn(e);
			var i = jn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = En;
		} finally {
			Sn = r, W = n;
		}
	}
}
function Q(e) {
	var t = (e.f & 2) != 0;
	if (xn?.add(e), V !== null && !H && !(W !== null && W.f & 16384) && (K === null || !K.has(e))) {
		var n = V.deps;
		if (V.f & 2097152) e.rv < X && (e.rv = X, q === null && n !== null && n[J] === e ? J++ : q === null ? q = [e] : q.push(e));
		else {
			V.deps ??= [], i.call(V.deps, e) || V.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [V] : i.call(r, V) || r.push(V);
		}
	}
	if (B && M.has(e)) return M.get(e);
	if (t) {
		var a = e;
		if (B) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || In(a)) && (o = dt(a)), M.set(a, o), o;
		}
		var s = (a.f & 512) == 0 && !H && V !== null && (Sn || (V.f & 512) != 0), c = (a.f & te) === 0;
		kn(a) && (s && (a.f |= 512), ft(a)), s && !c && (mt(a), Fn(a));
	}
	if (k?.has(e)) return k.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Fn(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (mt(t), Fn(t));
}
function In(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (M.has(t) || t.f & 2 && In(t)) return !0;
	return !1;
}
function Ln(e) {
	var t = H;
	try {
		return H = !0, e();
	} finally {
		H = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var Rn = Symbol("events"), zn = /* @__PURE__ */ new Set(), Bn = /* @__PURE__ */ new Set();
function Vn(e, t, n) {
	(t[Rn] ??= {})[e] = n;
}
function Hn(e) {
	for (var t = 0; t < e.length; t++) zn.add(e[t]);
	for (var n of Bn) n(e);
}
var Un = null;
function Wn(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Un = e;
	var o = 0, c = Un === e && e[Rn];
	if (c) {
		var l = i.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[Rn] = t;
			return;
		}
		var u = i.indexOf(t);
		if (u === -1) return;
		l <= u && (o = l);
	}
	if (a = i[o] || e.target, a !== t) {
		s(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var d = V, f = W;
		U(null), G(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[Rn]?.[r];
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
			e[Rn] = t, delete e.currentTarget, U(d), G(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Gn = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Kn(e) {
	return Gn?.createHTML(e) ?? e;
}
function qn(e) {
	var t = Zt("template");
	return t.innerHTML = Kn(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Jn(e, t) {
	var n = W;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function Yn(e, t) {
	var n = (t & 1) != 0, r = (t & 2) != 0, i, a = !e.startsWith("<!>");
	return () => {
		if (b) return Jn(x, null), x;
		i === void 0 && (i = qn(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ Kt(i)));
		var t = r || Ht ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ Kt(t), s = t.lastChild;
			Jn(o, s);
		} else Jn(t, t);
		return t;
	};
}
function Xn(e, t) {
	if (b) {
		var n = W;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = x), ke();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Zn = ["touchstart", "touchmove"];
function Qn(e) {
	return Zn.includes(e);
}
function $n(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[he] ??= e.nodeValue) && (e[he] = n, e.nodeValue = `${n}`);
}
function er(e, t) {
	return rr(e, t);
}
function tr(t, n) {
	Gt(), n.intro = n.intro ?? !1;
	let r = n.target, i = b, a = x;
	try {
		for (var o = /* @__PURE__ */ Kt(r); o && (o.nodeType !== 8 || o.data !== "[");) o = /* @__PURE__ */ I(o);
		if (!o) throw e;
		Oe(!0), S(o);
		let i = rr(t, {
			...n,
			anchor: o
		});
		return Oe(!1), i;
	} catch (i) {
		if (i instanceof Error && i.message.split("\n").some((e) => e.startsWith("https://svelte.dev/e/"))) throw i;
		return i !== e && console.warn("Failed to hydrate: ", i), n.recover === !1 && ye(), Gt(), Yt(r), Oe(!1), er(t, n);
	} finally {
		Oe(i), S(a);
	}
}
var nr = /* @__PURE__ */ new Map();
function rr(t, { target: n, anchor: r, props: i = {}, events: o, context: s, intro: c = !0, transformError: l }) {
	Gt();
	var u = void 0, d = an(() => {
		var c = r ?? n.appendChild(F());
		$e(c, { pending: () => {} }, (n) => {
			Re({});
			var r = C;
			if (s && (r.c = s), o && (i.$$events = o), b && Jn(n, null), u = t(n, i) || {}, b && (W.nodes.end = x, x === null || x.nodeType !== 8 || x.data !== "]")) throw Ee(), e;
			ze();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = Qn(r);
					for (let e of [n, document]) {
						var a = nr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), nr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Wn, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(a(zn)), Bn.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = nr.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Wn), t.delete(e), t.size === 0 && nr.delete(r)) : t.set(e, i);
			}
			Bn.delete(f), c !== r && c.parentNode?.removeChild(c);
		};
	});
	return ir.set(u, d), u;
}
var ir = /* @__PURE__ */ new WeakMap();
function ar(e, t) {
	let n = ir.get(e);
	return n ? (ir.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var or = class {
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
			if (n) vn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (vn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (z(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						bn(r, t), t.append(F()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else z(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), gn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (z(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = O, r = Xt();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = F();
			i.append(a), this.#n.set(e, {
				effect: R(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, R(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else b && (this.anchor = x), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function sr(e, t, n = !1) {
	var r;
	b && (r = x, ke());
	var i = new or(e), a = n ? re : 0;
	function o(e, t) {
		if (b) {
			var n = Ne(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Me();
				S(a), i.anchor = a, Oe(!1), i.ensure(e, t), Oe(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	un(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/css.js
function cr(e, t) {
	on(() => {
		var n = e.getRootNode(), r = n.host ? n : n.head ?? n.ownerDocument.head;
		if (!r.querySelector("#" + t.hash)) {
			let e = Zt("style");
			e.id = t.hash, e.textContent = t.code, r.appendChild(e);
		}
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function lr(e, t) {
	return e === t || e?.[ue] === t;
}
function ur(e = {}, t, n, r) {
	var i = C.r, a = W;
	return on(() => {
		var o, s;
		return cn(() => {
			o = s, s = r?.() || [], Ln(() => {
				lr(n(...s), e) || (t(e, ...s), o && lr(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && lr(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !0, a = (n & 8) != 0, o = (n & 16) != 0, s = r, l = !0, u = void 0, d = () => o && i ? (u ??= /* @__PURE__ */ at(r), Q(u)) : (l && (l = !1, s = o ? Ln(r) : r), s);
	let f;
	if (a) {
		var p = ue in e || de in e;
		f = c(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = Ye(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && be(t), f(m)));
	var g = i ? () => {
		var n = e[t];
		return n === void 0 ? d() : (l = !0, n);
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
	var v = !1, y = (n & 1 ? at : lt)(() => (v = !1, g()));
	a && Q(y);
	var ee = W;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? Q(y) : i && a ? Bt(e) : e;
			return P(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return B && v || ee.f & 16384 ? y.v : Q(y);
	});
}
//#endregion
//#region node_modules/svelte/src/legacy/legacy-client.js
function dr(e) {
	return new fr(e);
}
var fr = class {
	#e;
	#t;
	constructor(e) {
		var t = /* @__PURE__ */ new Map(), n = (e, n) => {
			var r = /* @__PURE__ */ Ft(n, !1, !1);
			return t.set(e, r), r;
		};
		let r = new Proxy({
			...e.props || {},
			$$events: {}
		}, {
			get(e, r) {
				return Q(t.get(r) ?? n(r, Reflect.get(e, r)));
			},
			has(e, r) {
				return r === de ? !0 : (Q(t.get(r) ?? n(r, Reflect.get(e, r))), Reflect.has(e, r));
			},
			set(e, r, i) {
				return P(t.get(r) ?? n(r, i), i), Reflect.set(e, r, i);
			}
		});
		this.#t = (e.hydrate ? tr : er)(e.component, {
			target: e.target,
			anchor: e.anchor,
			props: r,
			context: e.context,
			intro: e.intro ?? !1,
			recover: e.recover,
			transformError: e.transformError
		}), (!e?.props?.$$host || e.sync === !1) && A(), this.#e = r.$$events;
		for (let e of Object.keys(this.#t)) e === "$set" || e === "$destroy" || e === "$on" || s(this, e, {
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
			ar(this.#t);
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
}, pr;
typeof HTMLElement == "function" && (pr = class extends HTMLElement {
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
					let n = Zt("slot");
					e !== "default" && (n.name = e), Xn(t, n);
				};
			}
			let t = {}, n = hr(this);
			for (let r of this.$$s) r in n && (r === "default" && !this.$$d.children ? (this.$$d.children = e(r), t.default = !0) : t[r] = e(r));
			for (let e of this.attributes) {
				let t = this.$$g_p(e.name);
				t in this.$$d || (this.$$d[t] = mr(t, e.value, this.$$p_d, "toProp"));
			}
			for (let e in this.$$p_d) !(e in this.$$d) && this[e] !== void 0 && (this.$$d[e] = this[e], delete this[e]);
			this.$$c = dr({
				component: this.$$ctor,
				target: this.$$shadowRoot || this,
				props: {
					...this.$$d,
					$$slots: t,
					$$host: this
				}
			}), this.$$me = rn(() => {
				cn(() => {
					this.$$r = !0;
					for (let e of o(this.$$c)) {
						if (!this.$$p_d[e]?.reflect) continue;
						this.$$d[e] = this.$$c[e];
						let t = mr(e, this.$$d[e], this.$$p_d, "toAttribute");
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
		this.$$r || (e = this.$$g_p(e), this.$$d[e] = mr(e, n, this.$$p_d, "toProp"), this.$$c?.$set({ [e]: this.$$d[e] }));
	}
	disconnectedCallback() {
		this.$$cn = !1, Promise.resolve().then(() => {
			!this.$$cn && this.$$c && (this.$$c.$destroy(), this.$$me(), this.$$c = void 0);
		});
	}
	$$g_p(e) {
		return o(this.$$p_d).find((t) => this.$$p_d[t].attribute === e || !this.$$p_d[t].attribute && t.toLowerCase() === e) || e;
	}
});
function mr(e, t, n, r) {
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
function hr(e) {
	let t = {};
	return e.childNodes.forEach((e) => {
		t[e.slot || "default"] = !0;
	}), t;
}
function gr(e, t, n, r, i, a) {
	let l = class extends pr {
		constructor() {
			super(e, n, i), this.$$p_d = t;
		}
		static get observedAttributes() {
			return o(t).map((e) => (t[e].attribute || e).toLowerCase());
		}
	};
	return o(t).forEach((e) => {
		s(l.prototype, e, {
			get() {
				return this.$$c && e in this.$$c ? this.$$c[e] : this.$$d[e];
			},
			set(n) {
				n = mr(e, n, t), this.$$d[e] = n;
				var r = this.$$c;
				r && (c(r, e)?.get ? r[e] = n : r.$set({ [e]: n }));
			}
		});
	}), r.forEach((e) => {
		s(l.prototype, e, { get() {
			return this.$$c?.[e];
		} });
	}), a && (l = a(l)), e.element = l, l;
}
//#endregion
//#region src/types.ts
var _r = {
	done: "Marked as done",
	block: "Set blocker",
	unblock: "Cleared blocker",
	open: "Reopened",
	start: "Started",
	create: "Created",
	memory: "Added memory"
}, vr = /* @__PURE__ */ Yn("<button type=\"button\" class=\"wrn-undo-btn svelte-1nnfbw9\" title=\"Redo\">Redo</button>"), yr = /* @__PURE__ */ Yn("<div class=\"wrn-undo-receipt svelte-1nnfbw9\" role=\"status\"><span class=\"wrn-undo-icon svelte-1nnfbw9\">↩</span> <div class=\"wrn-undo-body svelte-1nnfbw9\"><strong class=\"svelte-1nnfbw9\"> </strong> <small class=\"svelte-1nnfbw9\"> </small></div> <div class=\"wrn-undo-actions svelte-1nnfbw9\"><button type=\"button\" class=\"wrn-undo-btn svelte-1nnfbw9\" title=\"Undo (⌘Z)\">Undo</button> <!></div></div>"), br = {
	hash: "svelte-1nnfbw9",
	code: ".wrn-undo-receipt.svelte-1nnfbw9 {display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--wrn-undo-bg, #fdfbf7);border:1px solid var(--wrn-undo-border, #e2ddd5);border-radius:var(--wrn-undo-radius, 6px);font-family:var(--wrn-undo-font, inherit);font-size:13px;color:var(--wrn-undo-text, #21322b);box-shadow:0 2px 8px rgba(0,0,0,0.06);}.wrn-undo-icon.svelte-1nnfbw9 {font-size:16px;opacity:0.7;flex-shrink:0;}.wrn-undo-body.svelte-1nnfbw9 {flex:1;display:grid;gap:2px;}.wrn-undo-body.svelte-1nnfbw9 strong:where(.svelte-1nnfbw9) {font-size:13px;font-weight:600;}.wrn-undo-body.svelte-1nnfbw9 small:where(.svelte-1nnfbw9) {font-size:11px;color:var(--wrn-undo-muted, #63746a);}.wrn-undo-actions.svelte-1nnfbw9 {display:flex;gap:4px;}.wrn-undo-btn.svelte-1nnfbw9 {padding:4px 10px;border:1px solid var(--wrn-undo-border, #e2ddd5);border-radius:4px;background:transparent;cursor:pointer;font:inherit;font-size:12px;color:var(--wrn-undo-text, #21322b);min-height:32px;}.wrn-undo-btn.svelte-1nnfbw9:hover {background:var(--wrn-undo-hover, #eaf4f0);}"
};
function xr(e, t) {
	Re(t, !0), cr(e, br);
	let n = $(t, "action", 7), r = $(t, "canRedo", 7, !1), i = $(t, "onundo", 7), a = $(t, "onredo", 7), o = /* @__PURE__ */ ct(() => _r[n().type] ?? n().label ?? "Action");
	var s = {
		get action() {
			return n();
		},
		set action(e) {
			n(e), A();
		},
		get canRedo() {
			return r();
		},
		set canRedo(e = !1) {
			r(e), A();
		},
		get onundo() {
			return i();
		},
		set onundo(e) {
			i(e), A();
		},
		get onredo() {
			return a();
		},
		set onredo(e) {
			a(e), A();
		}
	}, c = yr(), l = Jt(qt(c), 2), u = qt(l), d = qt(u, !0);
	Ae(u);
	var f = Jt(u, 2), p = qt(f, !0);
	Ae(f), Ae(l);
	var m = Jt(l, 2), h = qt(m), g = Jt(h, 2), _ = (e) => {
		var t = vr();
		Vn("click", t, () => a()?.()), Xn(e, t);
	};
	return sr(g, (e) => {
		r() && e(_);
	}), Ae(m), Ae(c), ln((e) => {
		$n(d, Q(o)), $n(p, e);
	}, [() => n().packId ? `${n().packId.substring(0, 24)}` : ""]), Vn("click", h, () => i()?.(n())), Xn(e, c), ze(s);
}
Hn(["click"]), gr(xr, {
	action: {},
	canRedo: {},
	onundo: {},
	onredo: {}
}, [], [], { mode: "open" });
//#endregion
//#region src/UndoElement.svelte
var Sr = /* @__PURE__ */ Yn("<div style=\"display:contents\"><!></div>");
function Cr(e, t) {
	Re(t, !0);
	let n = $(t, "label", 7, "Action"), r = $(t, "packid", 7, ""), i = $(t, "canredo", 7, !1), a;
	function o(e, t) {
		a?.dispatchEvent(new CustomEvent(e, {
			detail: t,
			bubbles: !0
		}));
	}
	let s = {
		type: "action",
		packId: r(),
		label: n(),
		createdAt: Date.now()
	};
	var c = {
		get label() {
			return n();
		},
		set label(e = "Action") {
			n(e), A();
		},
		get packid() {
			return r();
		},
		set packid(e = "") {
			r(e), A();
		},
		get canredo() {
			return i();
		},
		set canredo(e = !1) {
			i(e), A();
		}
	}, l = Sr();
	return xr(qt(l), {
		get action() {
			return s;
		},
		get canRedo() {
			return i();
		},
		onundo: () => o("wrn-undo", { action: s }),
		onredo: () => o("wrn-redo", {})
	}), Ae(l), ur(l, (e) => a = e, () => a), Xn(e, l), ze(c);
}
customElements.define("worn-undo", gr(Cr, {
	label: {},
	packid: {},
	canredo: { type: "Boolean" }
}, [], []));
//#endregion
export { Cr as default };
