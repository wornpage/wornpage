//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region node_modules/svelte/src/constants.js
var e = {}, t = Symbol("uninitialized"), n = Array.isArray, r = Array.prototype.indexOf, i = Array.prototype.includes, a = Array.from, o = Object.keys, s = Object.defineProperty, c = Object.getOwnPropertyDescriptor, l = Object.prototype, u = Array.prototype, d = Object.getPrototypeOf, f = Object.isExtensible;
function p(e) {
	return typeof e == "function";
}
var m = () => {};
function h(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function g() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var _ = 1024, v = 2048, y = 4096, ee = 8192, te = 16384, ne = 32768, re = 1 << 25, ie = 65536, ae = 1 << 19, oe = 1 << 20, se = 65536, ce = 1 << 21, le = 1 << 22, ue = 1 << 23, de = Symbol("$state"), fe = Symbol("legacy props"), pe = Symbol("attributes"), me = Symbol("class"), he = Symbol("style"), ge = Symbol("text"), _e = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
globalThis.document?.contentType;
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function ve() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function ye(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function be() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function xe(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Se() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ce() {
	throw Error("https://svelte.dev/e/hydration_failed");
}
function we(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Te() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ee() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function De() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Oe() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
function ke() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Ae(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function je() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var b = !1;
function Me(e) {
	b = e;
}
var x;
function S(t) {
	if (t === null) throw Ae(), e;
	return x = t;
}
function Ne() {
	return S(/* @__PURE__ */ I(x));
}
function Pe(t) {
	if (b) {
		if (/* @__PURE__ */ I(x) !== null) throw Ae(), e;
		x = t;
	}
}
function Fe(e = 1) {
	if (b) {
		for (var t = e, n = x; t--;) n = /* @__PURE__ */ I(n);
		x = n;
	}
}
function Ie(e = !0) {
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
function Le(t) {
	if (!t || t.nodeType !== 8) throw Ae(), e;
	return t.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Re(e) {
	return e === this.v;
}
function ze(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Be(e) {
	return !ze(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var C = null;
function Ve(e) {
	C = e;
}
function He(e, t = !1, n) {
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
function Ue(e) {
	var t = C, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) ln(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, C = t.p, e ?? {};
}
function We() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var w = [];
function Ge() {
	var e = w;
	w = [], h(e);
}
function T(e) {
	if (w.length === 0 && !xt) {
		var t = w;
		queueMicrotask(() => {
			t === w && Ge();
		});
	}
	w.push(e);
}
function Ke() {
	for (; w.length > 0;) Ge();
}
function qe(e) {
	var t = W;
	if (t === null) return V.f |= ue, e;
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
var Je = ~(v | y | _);
function D(e, t) {
	e.f = e.f & Je | t;
}
function Ye(e) {
	e.f & 512 || e.deps === null ? D(e, _) : D(e, y);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function Xe(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= se, Xe(t.deps));
}
function Ze(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), Xe(e.deps), D(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var Qe = !1;
function $e(e) {
	var t = Qe;
	try {
		return Qe = !1, [e(), Qe];
	} finally {
		Qe = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function et(e) {
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
function tt(e) {
	let t = 0, n = Lt(0), r;
	return () => {
		on() && (Q(n), mn(() => (t === 0 && (r = Un(() => e(() => Vt(n)))), t += 1, () => {
			T(() => {
				--t, t === 0 && (r?.(), r = void 0, Vt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var nt = ie | ae;
function rt(e, t, n, r) {
	new it(e, t, n, r);
}
var it = class {
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
	#h = tt(() => (this.#m = Lt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = W;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = W.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = gn(() => {
			if (b) {
				let e = this.#t;
				Ne();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, nt), b && (this.#e = x);
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
				je();
				return;
			}
			t = !0, n && Oe(), this.#s !== null && Sn(this.#s, () => {
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
			e.append(t), this.#a = this.#S(() => R(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Sn(this.#o, () => {
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
				En(this.#a, e);
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
		Ze(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = W, n = V, r = C;
		G(this.#i), U(this.#i), Ve(this.#i.ctx);
		try {
			return Dt.ensure(), e();
		} catch (e) {
			return qe(e), null;
		} finally {
			G(t), U(n), Ve(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Sn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, T(() => {
			this.#d = !1, this.#m && zt(this.#m, this.#l);
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
		this.#a &&= (z(this.#a), null), this.#o &&= (z(this.#o), null), this.#s &&= (z(this.#s), null), b && (S(this.#t), Fe(), S(Ie()));
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
function at(e, t, n, r) {
	let i = We() ? lt : ft;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = W, c = ot(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				E(e, s);
			}
			st();
		}
	}
	var d = ct();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ dt(e))).then(u).catch((e) => E(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), st();
	}) : f();
}
function ot() {
	var e = W, t = V, n = C, r = O;
	return function(i = !0) {
		G(e), U(t), Ve(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function st(e = !0) {
	G(null), U(null), Ve(null), e && O?.deactivate();
}
function ct() {
	var e = W, t = e.b, n = O, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function lt(e) {
	var n = 2 | v;
	return W !== null && (W.f |= ae), {
		ctx: C,
		deps: null,
		effects: null,
		equals: Re,
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
var ut = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function dt(e, n, r) {
	let i = W;
	i === null && ve();
	var a = void 0, o = Lt(t), s = !V, c = /* @__PURE__ */ new Set();
	return pn(() => {
		var t = W, n = g();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== _e && n.reject(e);
			}).finally(st);
		} catch (e) {
			n.reject(e), st();
		}
		var r = O;
		if (s) {
			if (t.f & 32768) var l = ct();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(ut);
			else for (let e of c.values()) e.reject(ut);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== ut && (r.activate(), t ? (o.f |= ue, zt(o, t)) : (o.f & 8388608 && (o.f ^= ue), zt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), sn(() => {
		for (let e of c) e.reject(ut);
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
function ft(e) {
	let t = /* @__PURE__ */ lt(e);
	return t.equals = Be, t;
}
function pt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) z(t[n]);
	}
}
function mt(e) {
	var n, r = W, i = e.parent;
	if (!B && i !== null && e.v !== t && i.f & 24576) return ke(), e.v;
	G(i);
	try {
		e.f &= ~se, pt(e), n = Ln(e);
	} finally {
		G(r);
	}
	return n;
}
function ht(e) {
	var t = mt(e);
	if (!e.equals(t) && (e.wv = Pn(), (!O?.is_fork || e.deps === null) && (O === null ? e.v = t : (O.capture(e, t, !0), yt?.capture(e, t, !0)), e.deps === null))) {
		D(e, _);
		return;
	}
	B || (k === null ? Ye(e) : (on() || O?.is_fork) && k.set(e, t));
}
function gt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && et(() => {
		t.ac.abort(_e), t.ac = null;
	}), t.fn !== null && (t.teardown = m), zn(t, 0), vn(t));
}
function _t(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Bn(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var vt = null, O = null, yt = null, k = null, bt = null, xt = !1, St = !1, Ct = null, wt = null, Tt = 0, Et = 1, Dt = class e {
	id = Et++;
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
		vt === null ? vt = this : (vt.#n = this, this.#t = vt), vt = this;
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
			for (var r of n.d) D(r, v), t(r);
			for (r of n.m) D(r, y), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Tt++ > 1e3 && (this.#x(), Ot());
		for (let e of this.#u) this.#d.delete(e), D(e, v), this.schedule(e);
		for (let e of this.#d) D(e, y), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Ct = [], r = [], i = wt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Pt(e), this.#h() || this.discard(), t;
		}
		if (O = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Ct = null, wt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Nt(e, t);
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
		this.#r.clear(), yt = this, kt(r), kt(n), yt = null, this.#s?.resolve();
		var s = O;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) if (s !== null) {
			let e = s;
			e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
		} else s = this;
		s !== null && s.#g();
	}
	#_(e, t, n) {
		e.f ^= _;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = (i & 96) != 0;
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= _ : i & 4 ? t.push(r) : Fn(r) && (i & 16 && this.#d.add(r), Bn(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), D(i, v), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), O = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) Ze(e[t], this.#u, this.#d);
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
			St = !0, O = this, this.#g();
		} finally {
			Tt = 0, bt = null, Ct = null, wt = null, St = !1, O = null, k = null, M.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(ut);
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
		return (this.#s ??= g()).promise;
	}
	static ensure() {
		if (O === null) {
			let t = O = new e();
			!St && !xt && T(() => {
				t.#e || t.flush();
			});
		}
		return O;
	}
	apply() {
		k = null;
	}
	schedule(e) {
		if (bt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Ct !== null && t === W && (V === null || !(V.f & 2))) return;
			if (n & 96) {
				if (!(n & 1024)) return;
				t.f ^= _;
			}
		}
		this.#c.push(t);
	}
	#x() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? vt = e : t.#t = e, this.linked = !1;
		}
	}
};
function A(e) {
	var t = xt;
	xt = !0;
	try {
		var n;
		for (e && (O !== null && !O.is_fork && O.flush(), n = e());;) {
			if (Ke(), O === null) return n;
			O.flush();
		}
	} finally {
		xt = t;
	}
}
function Ot() {
	try {
		Se();
	} catch (e) {
		E(e, bt);
	}
}
var j = null;
function kt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Fn(r) && (j = /* @__PURE__ */ new Set(), Bn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && xn(r), j?.size > 0)) {
				M.clear();
				for (let e of j) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) j.has(n) && (j.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Bn(n);
					}
				}
				j.clear();
			}
		}
		j = null;
	}
}
function At(e, t, n, r) {
	if (!n.has(e) && (n.add(e), e.reactions !== null)) for (let i of e.reactions) {
		let e = i.f;
		e & 2 ? At(i, t, n, r) : e & 4194320 && !(e & 2048) && jt(i, t, r) && (D(i, v), Mt(i));
	}
}
function jt(e, t, n) {
	let r = n.get(e);
	if (r !== void 0) return r;
	if (e.deps !== null) for (let r of e.deps) {
		if (i.call(t, r)) return !0;
		if (r.f & 2 && jt(r, t, n)) return n.set(r, !0), !0;
	}
	return n.set(e, !1), !1;
}
function Mt(e) {
	O.schedule(e);
}
function Nt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), D(e, _);
		for (var n = e.first; n !== null;) Nt(n, t), n = n.next;
	}
}
function Pt(e) {
	D(e, _);
	for (var t = e.first; t !== null;) Pt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Ft = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Map(), It = !1;
function Lt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Re,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t) {
	let n = Lt(e, t);
	return An(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Rt(e, t = !1, n = !0) {
	let r = Lt(e);
	return t || (r.equals = Be), r;
}
function P(e, t, n = !1) {
	return V !== null && (!H || V.f & 131072) && We() && V.f & 4325394 && (K === null || !K.has(e)) && De(), zt(e, n ? Ut(t) : t, wt);
}
function zt(e, t, n = null) {
	if (!e.equals(t)) {
		M.set(e, B ? t : e.v);
		var r = Dt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && mt(t), k === null && Ye(t);
		}
		e.wv = Pn(), Ht(e, v, n), We() && W !== null && W.f & 1024 && !(W.f & 96) && (Y === null ? jn([e]) : Y.push(e)), !r.is_fork && Ft.size > 0 && !It && Bt();
	}
	return t;
}
function Bt() {
	It = !1;
	for (let e of Ft) {
		e.f & 1024 && D(e, y);
		let t;
		try {
			t = Fn(e);
		} catch {
			t = !0;
		}
		t && Bn(e);
	}
	Ft.clear();
}
function Vt(e) {
	P(e, e.v + 1);
}
function Ht(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = We(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === W)) {
			var l = (c & v) === 0;
			if (l && D(s, t), c & 131072) Ft.add(s);
			else if (c & 2) {
				var u = s;
				k?.delete(u), c & 65536 || (c & 512 && (W === null || !(W.f & 2097152)) && (s.f |= se), Ht(u, y, n));
			} else if (l) {
				var d = s;
				c & 16 && j !== null && j.add(d), n === null ? Mt(d) : n.push(d);
			}
		}
	}
}
function Ut(e) {
	if (typeof e != "object" || !e || de in e) return e;
	let r = d(e);
	if (r !== l && r !== u) return e;
	var i = /* @__PURE__ */ new Map(), a = n(e), o = /* @__PURE__ */ N(0), s = null, f = Z, p = (e) => {
		if (Z === f) return e();
		var t = V, n = Z;
		U(null), Nn(f);
		var r = e();
		return U(t), Nn(n), r;
	};
	return a && i.set("length", /* @__PURE__ */ N(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Te();
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
					i.set(n, e), Vt(o);
				}
			} else P(r, t), Vt(o);
			return !0;
		},
		get(n, r, a) {
			if (r === de) return e;
			var o = i.get(r), l = r in n;
			if (o === void 0 && (!l || c(n, r)?.writable) && (o = p(() => /* @__PURE__ */ N(Ut(l ? n[r] : t), s)), i.set(r, o)), o !== void 0) {
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
			if (n === de) return !0;
			var r = i.get(n), a = r !== void 0 && r.v !== t || Reflect.has(e, n);
			return (r !== void 0 || W !== null && (!a || c(e, n)?.writable)) && (r === void 0 && (r = p(() => /* @__PURE__ */ N(a ? Ut(e[n]) : t, s)), i.set(n, r)), Q(r) === t) ? !1 : a;
		},
		set(e, n, r, l) {
			var u = i.get(n), d = n in e;
			if (a && n === "length") for (var f = r; f < u.v; f += 1) {
				var m = i.get(f + "");
				m === void 0 ? f in e && (m = p(() => /* @__PURE__ */ N(t, s)), i.set(f + "", m)) : P(m, t);
			}
			if (u === void 0) (!d || c(e, n)?.writable) && (u = p(() => /* @__PURE__ */ N(void 0, s)), P(u, Ut(r)), i.set(n, u));
			else {
				d = u.v !== t;
				var h = p(() => Ut(r));
				P(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, n);
			if (g?.set && g.set.call(l, r), !d) {
				if (a && typeof n == "string") {
					var _ = i.get("length"), v = Number(n);
					Number.isInteger(v) && v >= _.v && P(_, v + 1);
				}
				Vt(o);
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
			Ee();
		}
	});
}
var Wt, Gt, Kt, qt;
function Jt() {
	if (Wt === void 0) {
		Wt = window, Gt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Kt = c(t, "firstChild").get, qt = c(t, "nextSibling").get, f(e) && (e[me] = void 0, e[pe] = null, e[he] = void 0, e.__e = void 0), f(n) && (n[ge] = void 0);
	}
}
function F(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Yt(e) {
	return Kt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function I(e) {
	return qt.call(e);
}
function Xt(e, t) {
	if (!b) return /* @__PURE__ */ Yt(e);
	var n = /* @__PURE__ */ Yt(x);
	if (n === null) n = x.appendChild(F());
	else if (t && n.nodeType !== 3) {
		var r = F();
		return n?.before(r), S(r), r;
	}
	return t && nn(n), S(n), n;
}
function Zt(e, t = !1) {
	if (!b) {
		var n = /* @__PURE__ */ Yt(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ I(n) : n;
	}
	if (t) {
		if (x?.nodeType !== 3) {
			var r = F();
			return x?.before(r), S(r), r;
		}
		nn(x);
	}
	return x;
}
function Qt(e, t = 1, n = !1) {
	let r = b ? x : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ I(r);
	if (!b) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = F();
			return r === null ? i?.after(a) : r.before(a), S(a), a;
		}
		nn(r);
	}
	return S(r), r;
}
function $t(e) {
	e.textContent = "";
}
function en() {
	return !1;
}
function tn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function nn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function rn(e) {
	W === null && (V === null && xe(e), be()), B && ye(e);
}
function an(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function L(e, t) {
	var n = W;
	n !== null && n.f & 8192 && (e |= ee);
	var r = {
		ctx: C,
		deps: null,
		nodes: null,
		f: e | v | 512,
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
	if (e & 4) Ct === null ? Dt.ensure().schedule(r) : Ct.push(r);
	else if (t !== null) {
		try {
			Bn(r);
		} catch (e) {
			throw z(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ie));
	}
	if (i !== null && (i.parent = n, n !== null && an(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function on() {
	return V !== null && !H;
}
function sn(e) {
	let t = L(8, null);
	return D(t, _), t.teardown = e, t;
}
function cn(e) {
	rn("$effect");
	var t = W.f;
	if (!V && t & 32 && C !== null && !C.i) {
		var n = C;
		(n.e ??= []).push(e);
	} else return ln(e);
}
function ln(e) {
	return L(4 | oe, e);
}
function un(e) {
	Dt.ensure();
	let t = L(64 | ae, e);
	return () => {
		z(t);
	};
}
function dn(e) {
	Dt.ensure();
	let t = L(64 | ae, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Sn(t, () => {
			z(t), n(void 0);
		}) : (z(t), n(void 0));
	});
}
function fn(e) {
	return L(4, e);
}
function pn(e) {
	return L(le | ae, e);
}
function mn(e, t = 0) {
	return L(8 | t, e);
}
function hn(e, t = [], n = [], r = []) {
	at(r, t, n, (t) => {
		L(8, () => {
			e(...t.map(Q));
		});
	});
}
function gn(e, t = 0) {
	return L(16 | t, e);
}
function R(e) {
	return L(32 | ae, e);
}
function _n(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = B, n = V;
		kn(!0), U(null);
		try {
			t.call(null);
		} finally {
			kn(e), U(n);
		}
	}
}
function vn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && et(() => {
			e.abort(_e);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : z(n, t), n = r;
	}
}
function yn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || z(t), t = n;
	}
}
function z(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (bn(e.nodes.start, e.nodes.end), n = !0), e.f |= re, vn(e, t && !n), zn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	_n(e), e.f ^= re, e.f |= te;
	var i = e.parent;
	i !== null && i.first !== null && xn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function bn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ I(e);
		e.remove(), e = n;
	}
}
function xn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Sn(e, t, n = !0) {
	var r = [];
	Cn(e, r, !0);
	var i = () => {
		n && z(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Cn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ee;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = (i.f & 65536) != 0 || (i.f & 32) != 0 && (e.f & 16) != 0;
				Cn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function wn(e) {
	Tn(e, !0);
}
function Tn(e, t) {
	if (e.f & 8192) {
		e.f ^= ee, e.f & 1024 || (D(e, v), Dt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = (n.f & 65536) != 0 || (n.f & 32) != 0;
			Tn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function En(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ I(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Dn = null, On = !1, B = !1;
function kn(e) {
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
function An(e) {
	V !== null && (K ??= /* @__PURE__ */ new Set()).add(e);
}
var q = null, J = 0, Y = null;
function jn(e) {
	Y = e;
}
var Mn = 1, X = 0, Z = X;
function Nn(e) {
	Z = e;
}
function Pn() {
	return ++Mn;
}
function Fn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~se), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Fn(a) && ht(a), a.wv > e.wv) return !0;
		}
		t & 512 && k === null && D(e, _);
	}
	return !1;
}
function In(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(K !== null && K.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? In(a, t, !1) : t === a && (n ? D(a, v) : a.f & 1024 && D(a, y), Mt(a));
	}
}
function Ln(e) {
	var t = q, n = J, r = Y, i = V, a = K, o = C, s = H, c = Z, l = e.f;
	q = null, J = 0, Y = null, V = l & 96 ? null : e, K = null, Ve(e.ctx), H = !1, Z = ++X, e.ac !== null && (et(() => {
		e.ac.abort(_e);
	}), e.ac = null);
	try {
		e.f |= ce;
		var u = e.fn, d = u();
		e.f |= ne;
		var f = e.deps, p = O?.is_fork;
		if (q !== null) {
			var m;
			if (p || zn(e, J), f !== null && J > 0) for (f.length = J + q.length, m = 0; m < q.length; m++) f[J + m] = q[m];
			else e.deps = f = q;
			if (on() && e.f & 512) for (m = J; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && J < f.length && (zn(e, J), f.length = J);
		if (We() && Y !== null && !H && f !== null && !(e.f & 6146)) for (m = 0; m < Y.length; m++) In(Y[m], e);
		if (i !== null && i !== e) {
			if (X++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = X;
			if (t !== null) for (let e of t) e.rv = X;
			Y !== null && (r === null ? r = Y : r.push(...Y));
		}
		return e.f & 8388608 && (e.f ^= ue), d;
	} catch (e) {
		return qe(e);
	} finally {
		e.f ^= ce, q = t, J = n, Y = r, V = i, K = a, Ve(o), H = s, Z = c;
	}
}
function Rn(e, n) {
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
		c.f & 512 && (c.f ^= 512, c.f &= ~se), c.v !== t && Ye(c), c.ac !== null && et(() => {
			c.ac.abort(_e), c.ac = null, D(c, v);
		}), gt(c), zn(c, 0);
	}
}
function zn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Rn(e, n[r]);
}
function Bn(e) {
	var t = e.f;
	if (!(t & 16384)) {
		D(e, _);
		var n = W, r = On;
		W = e, On = (t & 96) == 0;
		try {
			t & 16777232 ? yn(e) : vn(e), _n(e);
			var i = Ln(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Mn;
		} finally {
			On = r, W = n;
		}
	}
}
function Q(e) {
	var t = (e.f & 2) != 0;
	if (Dn?.add(e), V !== null && !H && !(W !== null && W.f & 16384) && (K === null || !K.has(e))) {
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
			return (!(a.f & 1024) && a.reactions !== null || Hn(a)) && (o = mt(a)), M.set(a, o), o;
		}
		var s = (a.f & 512) == 0 && !H && V !== null && (On || (V.f & 512) != 0), c = (a.f & ne) === 0;
		Fn(a) && (s && (a.f |= 512), ht(a)), s && !c && (_t(a), Vn(a));
	}
	if (k?.has(e)) return k.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Vn(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (_t(t), Vn(t));
}
function Hn(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (M.has(t) || t.f & 2 && Hn(t)) return !0;
	return !1;
}
function Un(e) {
	var t = H;
	try {
		return H = !0, e();
	} finally {
		H = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var Wn = Symbol("events"), Gn = /* @__PURE__ */ new Set(), Kn = /* @__PURE__ */ new Set();
function qn(e, t, n) {
	(t[Wn] ??= {})[e] = n;
}
function Jn(e) {
	for (var t = 0; t < e.length; t++) Gn.add(e[t]);
	for (var n of Kn) n(e);
}
var Yn = null;
function Xn(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Yn = e;
	var o = 0, c = Yn === e && e[Wn];
	if (c) {
		var l = i.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[Wn] = t;
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
					var h = a[Wn]?.[r];
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
			e[Wn] = t, delete e.currentTarget, U(d), G(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Zn = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Qn(e) {
	return Zn?.createHTML(e) ?? e;
}
function $n(e) {
	var t = tn("template");
	return t.innerHTML = Qn(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function er(e, t) {
	var n = W;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function tr(e, t) {
	var n = (t & 1) != 0, r = (t & 2) != 0, i, a = !e.startsWith("<!>");
	return () => {
		if (b) return er(x, null), x;
		i === void 0 && (i = $n(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ Yt(i)));
		var t = r || Gt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ Yt(t), s = t.lastChild;
			er(o, s);
		} else er(t, t);
		return t;
	};
}
function nr() {
	if (b) return er(x, null), x;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = F();
	return e.append(t, n), er(t, n), e;
}
function rr(e, t) {
	if (b) {
		var n = W;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = x), Ne();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var ir = ["touchstart", "touchmove"];
function ar(e) {
	return ir.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/render.js
var or = !0;
function sr(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ge] ??= e.nodeValue) && (e[ge] = n, e.nodeValue = `${n}`);
}
function cr(e, t) {
	return dr(e, t);
}
function lr(t, n) {
	Jt(), n.intro = n.intro ?? !1;
	let r = n.target, i = b, a = x;
	try {
		for (var o = /* @__PURE__ */ Yt(r); o && (o.nodeType !== 8 || o.data !== "[");) o = /* @__PURE__ */ I(o);
		if (!o) throw e;
		Me(!0), S(o);
		let i = dr(t, {
			...n,
			anchor: o
		});
		return Me(!1), i;
	} catch (i) {
		if (i instanceof Error && i.message.split("\n").some((e) => e.startsWith("https://svelte.dev/e/"))) throw i;
		return i !== e && console.warn("Failed to hydrate: ", i), n.recover === !1 && Ce(), Jt(), $t(r), Me(!1), cr(t, n);
	} finally {
		Me(i), S(a);
	}
}
var ur = /* @__PURE__ */ new Map();
function dr(t, { target: n, anchor: r, props: i = {}, events: o, context: s, intro: c = !0, transformError: l }) {
	Jt();
	var u = void 0, d = dn(() => {
		var d = r ?? n.appendChild(F());
		rt(d, { pending: () => {} }, (n) => {
			He({});
			var r = C;
			if (s && (r.c = s), o && (i.$$events = o), b && er(n, null), or = c, u = t(n, i) || {}, or = !0, b && (W.nodes.end = x, x === null || x.nodeType !== 8 || x.data !== "]")) throw Ae(), e;
			Ue();
		}, l);
		var f = /* @__PURE__ */ new Set(), p = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!f.has(r)) {
					f.add(r);
					var i = ar(r);
					for (let e of [n, document]) {
						var a = ur.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), ur.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Xn, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return p(a(Gn)), Kn.add(p), () => {
			for (var e of f) for (let r of [n, document]) {
				var t = ur.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Xn), t.delete(e), t.size === 0 && ur.delete(r)) : t.set(e, i);
			}
			Kn.delete(p), d !== r && d.parentNode?.removeChild(d);
		};
	});
	return fr.set(u, d), u;
}
var fr = /* @__PURE__ */ new WeakMap();
function pr(e, t) {
	let n = fr.get(e);
	return n ? (fr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var mr = class {
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
			if (n) wn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (wn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						En(r, t), t.append(F()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else z(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Sn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (z(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = O, r = en();
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
function hr(e, t, n = !1) {
	var r;
	b && (r = x, Ne());
	var i = new mr(e), a = n ? ie : 0;
	function o(e, t) {
		if (b) {
			var n = Le(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Ie();
				S(a), i.anchor = a, Me(!1), i.ensure(e, t), Me(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	gn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/timing.js
var gr = () => performance.now(), $ = {
	tick: (e) => requestAnimationFrame(e),
	now: () => gr(),
	tasks: /* @__PURE__ */ new Set()
};
//#endregion
//#region node_modules/svelte/src/internal/client/loop.js
function _r() {
	let e = $.now();
	$.tasks.forEach((t) => {
		t.c(e) || ($.tasks.delete(t), t.f());
	}), $.tasks.size !== 0 && $.tick(_r);
}
function vr(e) {
	let t;
	return $.tasks.size === 0 && $.tick(_r), {
		promise: new Promise((n) => {
			$.tasks.add(t = {
				c: e,
				f: n
			});
		}),
		abort() {
			$.tasks.delete(t);
		}
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/transitions.js
function yr(e, t) {
	et(() => {
		e.dispatchEvent(new CustomEvent(t));
	});
}
function br(e) {
	if (e === "float") return "cssFloat";
	if (e === "offset") return "cssOffset";
	if (e.startsWith("--")) return e;
	let t = e.split("-");
	return t.length === 1 ? t[0] : t[0] + t.slice(1).map((e) => e[0].toUpperCase() + e.slice(1)).join("");
}
function xr(e) {
	let t = {}, n = e.split(";");
	for (let e of n) {
		let [n, r] = e.split(":");
		if (!n || r === void 0) break;
		let i = br(n.trim());
		t[i] = r.trim();
	}
	return t;
}
var Sr = (e) => e;
function Cr(e, t, n, r) {
	var i = (e & 1) != 0, a = (e & 2) != 0, o = i && a, s = (e & 4) != 0, c = o ? "both" : i ? "in" : "out", l, u = t.inert, d = t.style.overflow, f, p;
	function m() {
		return et(() => l ??= n()(t, r?.() ?? {}, { direction: c }));
	}
	var h = {
		is_global: s,
		in() {
			if (t.inert = u, !i) {
				p?.abort(), p?.reset?.();
				return;
			}
			a || f?.abort(), f = wr(t, m(), p, 1, () => {
				yr(t, "introstart");
			}, () => {
				yr(t, "introend"), f?.abort(), f = l = void 0, t.style.overflow = d;
			});
		},
		out(e) {
			if (!a) {
				e?.(), l = void 0;
				return;
			}
			t.inert = !0, p = wr(t, m(), f, 0, () => {
				yr(t, "outrostart");
			}, () => {
				yr(t, "outroend"), e?.();
			});
		},
		stop: () => {
			f?.abort(), p?.abort();
		}
	}, g = W;
	if ((g.nodes.t ??= []).push(h), i && or) {
		var _ = s;
		if (!_) {
			for (var v = g.parent; v && v.f & 65536;) for (; (v = v.parent) && !(v.f & 16););
			_ = !v || (v.f & 32768) != 0;
		}
		_ && fn(() => {
			Un(() => h.in());
		});
	}
}
function wr(e, t, n, r, i, a) {
	var o = r === 1;
	if (p(t)) {
		var s, c = !1;
		return T(() => {
			c || (s = wr(e, t({ direction: o ? "in" : "out" }), n, r, i, a));
		}), {
			abort: () => {
				c = !0, s?.abort();
			},
			deactivate: () => s.deactivate(),
			reset: () => s.reset(),
			t: () => s.t()
		};
	}
	if (n?.deactivate(), !t?.duration && !t?.delay) return i(), a(), {
		abort: m,
		deactivate: m,
		reset: m,
		t: () => r
	};
	let { delay: l = 0, css: u, tick: d, easing: f = Sr } = t;
	var h = [];
	if (o && n === void 0 && (d && d(0, 1), u)) {
		var g = xr(u(0, 1));
		h.push(g, g);
	}
	var _ = () => 1 - r, v = e.animate(h, {
		duration: l,
		fill: "forwards"
	});
	return v.onfinish = () => {
		v.cancel(), i();
		var o = n?.t() ?? 1 - r;
		n?.abort();
		var s = r - o, c = t.duration * Math.abs(s), l = [];
		if (c > 0) {
			var p = !1;
			if (u) for (var m = Math.ceil(c / (1e3 / 60)), h = 0; h <= m; h += 1) {
				var g = o + s * f(h / m), y = xr(u(g, 1 - g));
				l.push(y), p ||= y.overflow === "hidden";
			}
			p && (e.style.overflow = "hidden"), _ = () => {
				var e = v.currentTime;
				return o + s * f(e / c);
			}, d && vr(() => {
				if (v.playState !== "running") return !1;
				var e = _();
				return d(e, 1 - e), !0;
			});
		}
		v = e.animate(l, {
			duration: c,
			fill: "forwards"
		}), v.onfinish = () => {
			_ = () => r, d?.(r, 1 - r), a();
		};
	}, {
		abort: () => {
			v && (v.cancel(), v.effect = null, v.onfinish = m);
		},
		deactivate: () => {
			a = m;
		},
		reset: () => {
			r === 0 && d?.(1, 0);
		},
		t: () => _()
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/css.js
function Tr(e, t) {
	fn(() => {
		var n = e.getRootNode(), r = n.host ? n : n.head ?? n.ownerDocument.head;
		if (!r.querySelector("#" + t.hash)) {
			let e = tn("style");
			e.id = t.hash, e.textContent = t.code, r.appendChild(e);
		}
	});
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var Er = [..." 	\n\r\f\xA0\v﻿"];
function Dr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Er.includes(r[o - 1])) && (s === r.length || Er.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Or(e, t, n, r, i, a) {
	var o = e[me];
	if (b || o !== n || o === void 0) {
		var s = Dr(n, r, a);
		(!b || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[me] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function kr(e, t) {
	return e === t || e?.[de] === t;
}
function Ar(e = {}, t, n, r) {
	var i = C.r, a = W;
	return fn(() => {
		var o, s;
		return mn(() => {
			o = s, s = r?.() || [], Un(() => {
				kr(n(...s), e) || (t(e, ...s), o && kr(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && kr(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function jr(e, t, n, r) {
	var i = !0, a = (n & 8) != 0, o = (n & 16) != 0, s = r, l = !0, u = void 0, d = () => o && i ? (u ??= /* @__PURE__ */ lt(r), Q(u)) : (l && (l = !1, s = o ? Un(r) : r), s);
	let f;
	if (a) {
		var p = de in e || fe in e;
		f = c(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = $e(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && we(t), f(m)));
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
	var v = !1, y = (n & 1 ? lt : ft)(() => (v = !1, g()));
	a && Q(y);
	var ee = W;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? Q(y) : i && a ? Ut(e) : e;
			return P(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return B && v || ee.f & 16384 ? y.v : Q(y);
	});
}
//#endregion
//#region node_modules/svelte/src/legacy/legacy-client.js
function Mr(e) {
	return new Nr(e);
}
var Nr = class {
	#e;
	#t;
	constructor(e) {
		var t = /* @__PURE__ */ new Map(), n = (e, n) => {
			var r = /* @__PURE__ */ Rt(n, !1, !1);
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
				return r === fe ? !0 : (Q(t.get(r) ?? n(r, Reflect.get(e, r))), Reflect.has(e, r));
			},
			set(e, r, i) {
				return P(t.get(r) ?? n(r, i), i), Reflect.set(e, r, i);
			}
		});
		this.#t = (e.hydrate ? lr : cr)(e.component, {
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
			pr(this.#t);
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
}, Pr;
typeof HTMLElement == "function" && (Pr = class extends HTMLElement {
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
					let n = tn("slot");
					e !== "default" && (n.name = e), rr(t, n);
				};
			}
			let t = {}, n = Ir(this);
			for (let r of this.$$s) r in n && (r === "default" && !this.$$d.children ? (this.$$d.children = e(r), t.default = !0) : t[r] = e(r));
			for (let e of this.attributes) {
				let t = this.$$g_p(e.name);
				t in this.$$d || (this.$$d[t] = Fr(t, e.value, this.$$p_d, "toProp"));
			}
			for (let e in this.$$p_d) !(e in this.$$d) && this[e] !== void 0 && (this.$$d[e] = this[e], delete this[e]);
			this.$$c = Mr({
				component: this.$$ctor,
				target: this.$$shadowRoot || this,
				props: {
					...this.$$d,
					$$slots: t,
					$$host: this
				}
			}), this.$$me = un(() => {
				mn(() => {
					this.$$r = !0;
					for (let e of o(this.$$c)) {
						if (!this.$$p_d[e]?.reflect) continue;
						this.$$d[e] = this.$$c[e];
						let t = Fr(e, this.$$d[e], this.$$p_d, "toAttribute");
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
		this.$$r || (e = this.$$g_p(e), this.$$d[e] = Fr(e, n, this.$$p_d, "toProp"), this.$$c?.$set({ [e]: this.$$d[e] }));
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
function Fr(e, t, n, r) {
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
function Ir(e) {
	let t = {};
	return e.childNodes.forEach((e) => {
		t[e.slot || "default"] = !0;
	}), t;
}
function Lr(e, t, n, r, i, a) {
	let l = class extends Pr {
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
				n = Fr(e, n, t), this.$$d[e] = n;
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
//#region node_modules/svelte/src/transition/index.js
var Rr = (e) => e;
function zr(e) {
	let t = e - 1;
	return t * t * t + 1;
}
function Br(e) {
	let t = typeof e == "string" && e.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
	return t ? [parseFloat(t[1]), t[2] || "px"] : [e, "px"];
}
function Vr(e, { delay: t = 0, duration: n = 400, easing: r = Rr } = {}) {
	let i = +getComputedStyle(e).opacity;
	return {
		delay: t,
		duration: n,
		easing: r,
		css: (e) => `opacity: ${e * i}`
	};
}
function Hr(e, { delay: t = 0, duration: n = 400, easing: r = zr, x: i = 0, y: a = 0, opacity: o = 0 } = {}) {
	let s = getComputedStyle(e), c = +s.opacity, l = s.transform === "none" ? "" : s.transform, u = c * (1 - o), [d, f] = Br(i), [p, m] = Br(a);
	return {
		delay: t,
		duration: n,
		easing: r,
		css: (e, t) => `
			transform: ${l} translate(${(1 - e) * d}${f}, ${(1 - e) * p}${m});
			opacity: ${c - u * t}`
	};
}
//#endregion
//#region src/Toast.svelte
var Ur = /* @__PURE__ */ tr("<button type=\"button\"><span class=\"wrn-toast-icon svelte-1w29e1y\"> </span> <span class=\"wrn-toast-text svelte-1w29e1y\"> </span></button>"), Wr = {
	hash: "svelte-1w29e1y",
	code: ".wrn-toast.svelte-1w29e1y {display:flex;align-items:flex-start;gap:8px;background:var(--wrn-toast-bg, #fdfbf7);border:1px solid var(--wrn-toast-border, #e2ddd5);border-radius:var(--wrn-toast-radius, 6px);padding:10px 14px;font-family:var(--wrn-toast-font, inherit);font-size:13px;font-weight:600;color:var(--wrn-toast-text, #21322b);cursor:pointer;text-align:start;width:100%;box-sizing:border-box;box-shadow:0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);position:relative;overflow:hidden;}.wrn-toast.is-error.svelte-1w29e1y {border-color:var(--wrn-toast-error-border, #e74c3c);background:var(--wrn-toast-error-bg, #fdf0ef);}.wrn-toast.is-success.svelte-1w29e1y {border-color:var(--wrn-toast-success-border, #27ae60);background:var(--wrn-toast-success-bg, #edf9f0);}.wrn-toast-icon.svelte-1w29e1y {font-size:14px;line-height:1;flex-shrink:0;}.wrn-toast.is-error.svelte-1w29e1y .wrn-toast-icon:where(.svelte-1w29e1y) {color:var(--wrn-toast-error-text, #e74c3c);}.wrn-toast.is-success.svelte-1w29e1y .wrn-toast-icon:where(.svelte-1w29e1y) {color:var(--wrn-toast-success-text, #27ae60);}.wrn-toast-text.svelte-1w29e1y {flex:1;min-width:0;line-height:1.3;}"
};
function Gr(e, t) {
	He(t, !0), Tr(e, Wr);
	let n = jr(t, "message", 7), r = jr(t, "kind", 7, "info"), i = jr(t, "ondismiss", 7), a = jr(t, "duration", 7, 3e3), o = /* @__PURE__ */ N(!0);
	function s() {
		P(o, !1), setTimeout(() => i()?.(), 200);
	}
	cn(() => {
		if (a() <= 0) return;
		let e = setTimeout(() => s(), a());
		return () => clearTimeout(e);
	});
	var c = {
		get message() {
			return n();
		},
		set message(e) {
			n(e), A();
		},
		get kind() {
			return r();
		},
		set kind(e = "info") {
			r(e), A();
		},
		get ondismiss() {
			return i();
		},
		set ondismiss(e) {
			i(e), A();
		},
		get duration() {
			return a();
		},
		set duration(e = 3e3) {
			a(e), A();
		}
	}, l = nr(), u = Zt(l), d = (e) => {
		var t = Ur();
		let i;
		var a = Xt(t), o = Xt(a, !0);
		Pe(a);
		var c = Qt(a, 2), l = Xt(c, !0);
		Pe(c), Pe(t), hn(() => {
			i = Or(t, 1, "wrn-toast svelte-1w29e1y", null, i, {
				"is-error": r() === "error",
				"is-success": r() === "success"
			}), sr(o, r() === "error" ? "✗" : r() === "success" ? "✓" : "→"), sr(l, n());
		}), qn("click", t, s), Cr(1, t, () => Hr, () => ({
			x: 120,
			duration: 220
		})), Cr(2, t, () => Vr, () => ({ duration: 180 })), rr(e, t);
	};
	return hr(u, (e) => {
		Q(o) && e(d);
	}), rr(e, l), Ue(c);
}
Jn(["click"]), Lr(Gr, {
	message: {},
	kind: {},
	ondismiss: {},
	duration: {}
}, [], [], { mode: "open" });
//#endregion
//#region src/ToastElement.svelte
var Kr = /* @__PURE__ */ tr("<div><!></div>");
function qr(e, t) {
	He(t, !0);
	let n = jr(t, "message", 7, ""), r = jr(t, "kind", 7, "info"), i = jr(t, "duration", 7, 3e3), a;
	function o(e, t) {
		a?.dispatchEvent(new CustomEvent(e, {
			detail: t,
			bubbles: !0
		}));
	}
	var s = {
		get message() {
			return n();
		},
		set message(e = "") {
			n(e), A();
		},
		get kind() {
			return r();
		},
		set kind(e = "info") {
			r(e), A();
		},
		get duration() {
			return i();
		},
		set duration(e = 3e3) {
			i(e), A();
		}
	}, c = Kr();
	return Gr(Xt(c), {
		get message() {
			return n();
		},
		get kind() {
			return r();
		},
		get duration() {
			return i();
		},
		ondismiss: () => o("worn-dismiss", {})
	}), Pe(c), Ar(c, (e) => a = e, () => a), rr(e, c), Ue(s);
}
customElements.define("worn-toast", Lr(qr, {
	message: {},
	kind: {},
	duration: { type: "Number" }
}, [], []));
//#endregion
export { qr as default };
