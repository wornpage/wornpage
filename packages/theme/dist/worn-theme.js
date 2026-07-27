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
var g = 1024, _ = 2048, v = 4096, y = 8192, b = 16384, x = 32768, S = 1 << 25, ee = 65536, C = 1 << 19, te = 1 << 20, ne = 1 << 25, re = 65536, ie = 1 << 21, ae = 1 << 22, oe = 1 << 23, se = Symbol("$state"), ce = Symbol("legacy props"), le = Symbol("attributes"), ue = Symbol("class"), de = Symbol("style"), fe = Symbol("text"), pe = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
globalThis.document?.contentType;
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function me() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function he(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function ge(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function _e() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function ve(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function ye() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function be() {
	throw Error("https://svelte.dev/e/hydration_failed");
}
function xe(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Se() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ce() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function we() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Te() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
function Ee() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function De(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Oe() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var w = !1;
function ke(e) {
	w = e;
}
var T;
function E(t) {
	if (t === null) throw De(), e;
	return T = t;
}
function Ae() {
	return E(/* @__PURE__ */ R(T));
}
function je(t) {
	if (w) {
		if (/* @__PURE__ */ R(T) !== null) throw De(), e;
		T = t;
	}
}
function Me(e = 1) {
	if (w) {
		for (var t = e, n = T; t--;) n = /* @__PURE__ */ R(n);
		T = n;
	}
}
function Ne(e = !0) {
	for (var t = 0, n = T;;) {
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
function Pe(t) {
	if (!t || t.nodeType !== 8) throw De(), e;
	return t.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Fe(e) {
	return e === this.v;
}
function Ie(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Le(e) {
	return !Ie(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var D = null;
function Re(e) {
	D = e;
}
function ze(e, t = !1, n) {
	D = {
		p: D,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: K,
		l: null
	};
}
function Be(e) {
	var t = D, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) cn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, D = t.p, e ?? {};
}
function Ve() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var He = [];
function Ue() {
	var e = He;
	He = [], m(e);
}
function O(e) {
	if (He.length === 0 && !bt) {
		var t = He;
		queueMicrotask(() => {
			t === He && Ue();
		});
	}
	He.push(e);
}
function We() {
	for (; He.length > 0;) Ue();
}
function Ge(e) {
	var t = K;
	if (t === null) return U.f |= oe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	k(e, t);
}
function k(e, t) {
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
var Ke = ~(_ | v | g);
function A(e, t) {
	e.f = e.f & Ke | t;
}
function qe(e) {
	e.f & 512 || e.deps === null ? A(e, g) : A(e, v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function Je(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= re, Je(t.deps));
}
function Ye(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), Je(e.deps), A(e, g);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var Xe = !1;
function Ze(e) {
	var t = Xe;
	try {
		return Xe = !1, [e(), Xe];
	} finally {
		Xe = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function Qe(e) {
	var t = U, n = K;
	G(null), q(null);
	try {
		return e();
	} finally {
		G(t), q(n);
	}
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function $e(e) {
	let t = 0, n = Lt(0), r;
	return () => {
		an() && (Q(n), pn(() => (t === 0 && (r = Wn(() => e(() => Vt(n)))), t += 1, () => {
			O(() => {
				--t, t === 0 && (r?.(), r = void 0, Vt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var et = ee | C;
function tt(e, t, n, r) {
	new nt(e, t, n, r);
}
var nt = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = w ? T : null;
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
	#h = $e(() => (this.#m = Lt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = K;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = K.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = hn(() => {
			if (w) {
				let e = this.#t;
				Ae();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, et), w && (this.#e = T);
	}
	#g() {
		try {
			this.#a = B(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		O(r), t && (this.#s = B(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Oe();
				return;
			}
			t = !0, n && Te(), this.#s !== null && xn(this.#s, () => {
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
					k(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = B(() => e(this.#e)), O(() => {
			var e = this.#c = document.createDocumentFragment(), t = L();
			e.append(t), this.#a = this.#S(() => B(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, xn(this.#o, () => {
				this.#o = null;
			}), this.#x(j));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = B(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Tn(this.#a, e);
				let t = this.#n.pending;
				this.#o = B(() => t(this.#e));
			} else this.#x(j);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		Ye(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = K, n = U, r = D;
		q(this.#i), G(this.#i), Re(this.#i.ctx);
		try {
			return Et.ensure(), e();
		} catch (e) {
			return Ge(e), null;
		} finally {
			q(t), G(n), Re(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && xn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, O(() => {
			this.#d = !1, this.#m && zt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Q(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		j?.is_fork ? (this.#a && j.skip_effect(this.#a), this.#o && j.skip_effect(this.#o), this.#s && j.skip_effect(this.#s), j.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (V(this.#a), null), this.#o &&= (V(this.#o), null), this.#s &&= (V(this.#s), null), w && (E(this.#t), Me(), E(Ne()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return B(() => {
						var r = K;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return k(e, this.#i.parent), null;
				}
			}));
		};
		O(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				k(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => k(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function rt(e, t, n, r) {
	let i = Ve() ? st : dt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = K, c = it(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				k(e, s);
			}
			at();
		}
	}
	var d = ot();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ lt(e))).then(u).catch((e) => k(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), at();
	}) : f();
}
function it() {
	var e = K, t = U, n = D, r = j;
	return function(i = !0) {
		q(e), G(t), Re(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function at(e = !0) {
	q(null), G(null), Re(null), e && j?.deactivate();
}
function ot() {
	var e = K, t = e.b, n = j, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function st(e) {
	var n = 2 | _;
	return K !== null && (K.f |= C), {
		ctx: D,
		deps: null,
		effects: null,
		equals: Fe,
		f: n,
		fn: e,
		reactions: null,
		rv: 0,
		v: t,
		wv: 0,
		parent: K,
		ac: null
	};
}
var ct = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function lt(e, n, r) {
	let i = K;
	i === null && me();
	var a = void 0, o = Lt(t), s = !U, c = /* @__PURE__ */ new Set();
	return fn(() => {
		var t = K, n = h();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== pe && n.reject(e);
			}).finally(at);
		} catch (e) {
			n.reject(e), at();
		}
		var r = j;
		if (s) {
			if (t.f & 32768) var l = ot();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(ct);
			else for (let e of c.values()) e.reject(ct);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== ct && (r.activate(), t ? (o.f |= oe, zt(o, t)) : (o.f & 8388608 && (o.f ^= oe), zt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), on(() => {
		for (let e of c) e.reject(ct);
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
function ut(e) {
	let t = /* @__PURE__ */ st(e);
	return kn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function dt(e) {
	let t = /* @__PURE__ */ st(e);
	return t.equals = Le, t;
}
function ft(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) V(t[n]);
	}
}
function pt(e) {
	var n, r = K, i = e.parent;
	if (!H && i !== null && e.v !== t && i.f & 24576) return Ee(), e.v;
	q(i);
	try {
		e.f &= ~re, ft(e), n = Rn(e);
	} finally {
		q(r);
	}
	return n;
}
function mt(e) {
	var t = pt(e);
	if (!e.equals(t) && (e.wv = Fn(), (!j?.is_fork || e.deps === null) && (j === null ? e.v = t : (j.capture(e, t, !0), vt?.capture(e, t, !0)), e.deps === null))) {
		A(e, g);
		return;
	}
	H || (M === null ? qe(e) : (an() || j?.is_fork) && M.set(e, t));
}
function ht(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && Qe(() => {
		t.ac.abort(pe), t.ac = null;
	}), t.fn !== null && (t.teardown = p), Bn(t, 0), _n(t));
}
function gt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Vn(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var _t = null, j = null, vt = null, M = null, yt = null, bt = !1, xt = !1, St = null, Ct = null, wt = 0, Tt = 1, Et = class e {
	id = Tt++;
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
		_t === null ? _t = this : (_t.#n = this, this.#t = _t), _t = this;
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
			for (var r of n.d) A(r, _), t(r);
			for (r of n.m) A(r, v), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, wt++ > 1e3 && (this.#x(), Ot());
		for (let e of this.#u) this.#d.delete(e), A(e, _), this.schedule(e);
		for (let e of this.#d) A(e, v), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = St = [], r = [], i = Ct = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Pt(e), this.#h() || this.discard(), t;
		}
		if (j = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (St = null, Ct = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Nt(e, t);
			i.length > 0 && j.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), vt = this, kt(r), kt(n), vt = null, this.#s?.resolve();
		var s = j;
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
				a ? r.f ^= g : i & 4 ? t.push(r) : In(r) && (i & 16 && this.#d.add(r), Vn(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), A(i, _), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), j = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) Ye(e[t], this.#u, this.#d);
	}
	capture(e, n, r = !1) {
		e.v !== t && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [n, r]), M?.set(e, n)), this.is_fork || (e.v = n);
	}
	activate() {
		j = this;
	}
	deactivate() {
		j = null, M = null;
	}
	flush() {
		try {
			xt = !0, j = this, this.#g();
		} finally {
			wt = 0, yt = null, St = null, Ct = null, xt = !1, j = null, M = null, P.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(ct);
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
		this.#m || (this.#m = !0, O(() => {
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
		if (j === null) {
			let t = j = new e();
			!xt && !bt && O(() => {
				t.#e || t.flush();
			});
		}
		return j;
	}
	apply() {
		M = null;
	}
	schedule(e) {
		if (yt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (St !== null && t === K && (U === null || !(U.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? _t = e : t.#t = e, this.linked = !1;
		}
	}
};
function Dt(e) {
	var t = bt;
	bt = !0;
	try {
		var n;
		for (e && (j !== null && !j.is_fork && j.flush(), n = e());;) {
			if (We(), j === null) return n;
			j.flush();
		}
	} finally {
		bt = t;
	}
}
function Ot() {
	try {
		ye();
	} catch (e) {
		k(e, yt);
	}
}
var N = null;
function kt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && In(r) && (N = /* @__PURE__ */ new Set(), Vn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && bn(r), N?.size > 0)) {
				P.clear();
				for (let e of N) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) N.has(n) && (N.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Vn(n);
					}
				}
				N.clear();
			}
		}
		N = null;
	}
}
function At(e, t, n, r) {
	if (!n.has(e) && (n.add(e), e.reactions !== null)) for (let i of e.reactions) {
		let e = i.f;
		e & 2 ? At(i, t, n, r) : e & 4194320 && !(e & 2048) && jt(i, t, r) && (A(i, _), Mt(i));
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
	j.schedule(e);
}
function Nt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), A(e, g);
		for (var n = e.first; n !== null;) Nt(n, t), n = n.next;
	}
}
function Pt(e) {
	A(e, g);
	for (var t = e.first; t !== null;) Pt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Ft = /* @__PURE__ */ new Set(), P = /* @__PURE__ */ new Map(), It = !1;
function Lt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Fe,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function F(e, t) {
	let n = Lt(e, t);
	return kn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Rt(e, t = !1, n = !0) {
	let r = Lt(e);
	return t || (r.equals = Le), r;
}
function I(e, t, n = !1) {
	return U !== null && (!W || U.f & 131072) && Ve() && U.f & 4325394 && (J === null || !J.has(e)) && we(), zt(e, n ? Ut(t) : t, Ct);
}
function zt(e, t, n = null) {
	if (!e.equals(t)) {
		P.set(e, H ? t : e.v);
		var r = Et.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && pt(t), M === null && qe(t);
		}
		e.wv = Fn(), Ht(e, _, n), Ve() && K !== null && K.f & 1024 && !(K.f & 96) && (Z === null ? An([e]) : Z.push(e)), !r.is_fork && Ft.size > 0 && !It && Bt();
	}
	return t;
}
function Bt() {
	It = !1;
	for (let e of Ft) {
		e.f & 1024 && A(e, v);
		let t;
		try {
			t = In(e);
		} catch {
			t = !0;
		}
		t && Vn(e);
	}
	Ft.clear();
}
function Vt(e) {
	I(e, e.v + 1);
}
function Ht(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ve(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === K)) {
			var l = (c & _) === 0;
			if (l && A(s, t), c & 131072) Ft.add(s);
			else if (c & 2) {
				var u = s;
				M?.delete(u), c & 65536 || (c & 512 && (K === null || !(K.f & 2097152)) && (s.f |= re), Ht(u, v, n));
			} else if (l) {
				var d = s;
				c & 16 && N !== null && N.add(d), n === null ? Mt(d) : n.push(d);
			}
		}
	}
}
function Ut(e) {
	if (typeof e != "object" || !e || se in e) return e;
	let r = d(e);
	if (r !== l && r !== u) return e;
	var i = /* @__PURE__ */ new Map(), a = n(e), o = /* @__PURE__ */ F(0), s = null, f = Nn, p = (e) => {
		if (Nn === f) return e();
		var t = U, n = Nn;
		G(null), Pn(f);
		var r = e();
		return G(t), Pn(n), r;
	};
	return a && i.set("length", /* @__PURE__ */ F(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Se();
			var r = i.get(t);
			return r === void 0 ? p(() => {
				var e = /* @__PURE__ */ F(n.value, s);
				return i.set(t, e), e;
			}) : I(r, n.value, !0), !0;
		},
		deleteProperty(e, n) {
			var r = i.get(n);
			if (r === void 0) {
				if (n in e) {
					let e = p(() => /* @__PURE__ */ F(t, s));
					i.set(n, e), Vt(o);
				}
			} else I(r, t), Vt(o);
			return !0;
		},
		get(n, r, a) {
			if (r === se) return e;
			var o = i.get(r), l = r in n;
			if (o === void 0 && (!l || c(n, r)?.writable) && (o = p(() => /* @__PURE__ */ F(Ut(l ? n[r] : t), s)), i.set(r, o)), o !== void 0) {
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
			if (n === se) return !0;
			var r = i.get(n), a = r !== void 0 && r.v !== t || Reflect.has(e, n);
			return (r !== void 0 || K !== null && (!a || c(e, n)?.writable)) && (r === void 0 && (r = p(() => /* @__PURE__ */ F(a ? Ut(e[n]) : t, s)), i.set(n, r)), Q(r) === t) ? !1 : a;
		},
		set(e, n, r, l) {
			var u = i.get(n), d = n in e;
			if (a && n === "length") for (var f = r; f < u.v; f += 1) {
				var m = i.get(f + "");
				m === void 0 ? f in e && (m = p(() => /* @__PURE__ */ F(t, s)), i.set(f + "", m)) : I(m, t);
			}
			if (u === void 0) (!d || c(e, n)?.writable) && (u = p(() => /* @__PURE__ */ F(void 0, s)), I(u, Ut(r)), i.set(n, u));
			else {
				d = u.v !== t;
				var h = p(() => Ut(r));
				I(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, n);
			if (g?.set && g.set.call(l, r), !d) {
				if (a && typeof n == "string") {
					var _ = i.get("length"), v = Number(n);
					Number.isInteger(v) && v >= _.v && I(_, v + 1);
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
			Ce();
		}
	});
}
var Wt, Gt, Kt, qt;
function Jt() {
	if (Wt === void 0) {
		Wt = window, Gt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Kt = c(t, "firstChild").get, qt = c(t, "nextSibling").get, f(e) && (e[ue] = void 0, e[le] = null, e[de] = void 0, e.__e = void 0), f(n) && (n[fe] = void 0);
	}
}
function L(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Yt(e) {
	return Kt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function R(e) {
	return qt.call(e);
}
function Xt(e, t) {
	if (!w) return /* @__PURE__ */ Yt(e);
	var n = /* @__PURE__ */ Yt(T);
	if (n === null) n = T.appendChild(L());
	else if (t && n.nodeType !== 3) {
		var r = L();
		return n?.before(r), E(r), r;
	}
	return t && tn(n), E(n), n;
}
function Zt(e, t = !1) {
	if (!w) {
		var n = /* @__PURE__ */ Yt(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ R(n) : n;
	}
	if (t) {
		if (T?.nodeType !== 3) {
			var r = L();
			return T?.before(r), E(r), r;
		}
		tn(T);
	}
	return T;
}
function Qt(e) {
	e.textContent = "";
}
function $t() {
	return !1;
}
function en(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function tn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function nn(e) {
	K === null && (U === null && ve(e), _e()), H && ge(e);
}
function rn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function z(e, t) {
	var n = K;
	n !== null && n.f & 8192 && (e |= y);
	var r = {
		ctx: D,
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
	j?.register_created_effect(r);
	var i = r;
	if (e & 4) St === null ? Et.ensure().schedule(r) : St.push(r);
	else if (t !== null) {
		try {
			Vn(r);
		} catch (e) {
			throw V(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ee));
	}
	if (i !== null && (i.parent = n, n !== null && rn(i, n), U !== null && U.f & 2 && !(e & 64))) {
		var a = U;
		(a.effects ??= []).push(i);
	}
	return r;
}
function an() {
	return U !== null && !W;
}
function on(e) {
	let t = z(8, null);
	return A(t, g), t.teardown = e, t;
}
function sn(e) {
	nn("$effect");
	var t = K.f;
	if (!U && t & 32 && D !== null && !D.i) {
		var n = D;
		(n.e ??= []).push(e);
	} else return cn(e);
}
function cn(e) {
	return z(4 | te, e);
}
function ln(e) {
	Et.ensure();
	let t = z(64 | C, e);
	return () => {
		V(t);
	};
}
function un(e) {
	Et.ensure();
	let t = z(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? xn(t, () => {
			V(t), n(void 0);
		}) : (V(t), n(void 0));
	});
}
function dn(e) {
	return z(4, e);
}
function fn(e) {
	return z(ae | C, e);
}
function pn(e, t = 0) {
	return z(8 | t, e);
}
function mn(e, t = [], n = [], r = []) {
	rt(r, t, n, (t) => {
		z(8, () => {
			e(...t.map(Q));
		});
	});
}
function hn(e, t = 0) {
	return z(16 | t, e);
}
function B(e) {
	return z(32 | C, e);
}
function gn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = H, n = U;
		On(!0), G(null);
		try {
			t.call(null);
		} finally {
			On(e), G(n);
		}
	}
}
function _n(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && Qe(() => {
			e.abort(pe);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : V(n, t), n = r;
	}
}
function vn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || V(t), t = n;
	}
}
function V(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (yn(e.nodes.start, e.nodes.end), n = !0), e.f |= S, _n(e, t && !n), Bn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	gn(e), e.f ^= S, e.f |= b;
	var i = e.parent;
	i !== null && i.first !== null && bn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function yn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ R(e);
		e.remove(), e = n;
	}
}
function bn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function xn(e, t, n = !0) {
	var r = [];
	Sn(e, r, !0);
	var i = () => {
		n && V(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Sn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= y;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = (i.f & 65536) != 0 || (i.f & 32) != 0 && (e.f & 16) != 0;
				Sn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Cn(e) {
	wn(e, !0);
}
function wn(e, t) {
	if (e.f & 8192) {
		e.f ^= y, e.f & 1024 || (A(e, _), Et.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = (n.f & 65536) != 0 || (n.f & 32) != 0;
			wn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Tn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ R(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var En = null, Dn = !1, H = !1;
function On(e) {
	H = e;
}
var U = null, W = !1;
function G(e) {
	U = e;
}
var K = null;
function q(e) {
	K = e;
}
var J = null;
function kn(e) {
	U !== null && (J ??= /* @__PURE__ */ new Set()).add(e);
}
var Y = null, X = 0, Z = null;
function An(e) {
	Z = e;
}
var jn = 1, Mn = 0, Nn = Mn;
function Pn(e) {
	Nn = e;
}
function Fn() {
	return ++jn;
}
function In(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~re), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (In(a) && mt(a), a.wv > e.wv) return !0;
		}
		t & 512 && M === null && A(e, g);
	}
	return !1;
}
function Ln(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(J !== null && J.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Ln(a, t, !1) : t === a && (n ? A(a, _) : a.f & 1024 && A(a, v), Mt(a));
	}
}
function Rn(e) {
	var t = Y, n = X, r = Z, i = U, a = J, o = D, s = W, c = Nn, l = e.f;
	Y = null, X = 0, Z = null, U = l & 96 ? null : e, J = null, Re(e.ctx), W = !1, Nn = ++Mn, e.ac !== null && (Qe(() => {
		e.ac.abort(pe);
	}), e.ac = null);
	try {
		e.f |= ie;
		var u = e.fn, d = u();
		e.f |= x;
		var f = e.deps, p = j?.is_fork;
		if (Y !== null) {
			var m;
			if (p || Bn(e, X), f !== null && X > 0) for (f.length = X + Y.length, m = 0; m < Y.length; m++) f[X + m] = Y[m];
			else e.deps = f = Y;
			if (an() && e.f & 512) for (m = X; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && X < f.length && (Bn(e, X), f.length = X);
		if (Ve() && Z !== null && !W && f !== null && !(e.f & 6146)) for (m = 0; m < Z.length; m++) Ln(Z[m], e);
		if (i !== null && i !== e) {
			if (Mn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Mn;
			if (t !== null) for (let e of t) e.rv = Mn;
			Z !== null && (r === null ? r = Z : r.push(...Z));
		}
		return e.f & 8388608 && (e.f ^= oe), d;
	} catch (e) {
		return Ge(e);
	} finally {
		e.f ^= ie, Y = t, X = n, Z = r, U = i, J = a, Re(o), W = s, Nn = c;
	}
}
function zn(e, n) {
	let a = n.reactions;
	if (a !== null) {
		var o = r.call(a, e);
		if (o !== -1) {
			var s = a.length - 1;
			s === 0 ? a = n.reactions = null : (a[o] = a[s], a.pop());
		}
	}
	if (a === null && n.f & 2 && (Y === null || !i.call(Y, n))) {
		var c = n;
		c.f & 512 && (c.f ^= 512, c.f &= ~re), c.v !== t && qe(c), c.ac !== null && Qe(() => {
			c.ac.abort(pe), c.ac = null, A(c, _);
		}), ht(c), Bn(c, 0);
	}
}
function Bn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) zn(e, n[r]);
}
function Vn(e) {
	var t = e.f;
	if (!(t & 16384)) {
		A(e, g);
		var n = K, r = Dn;
		K = e, Dn = (t & 96) == 0;
		try {
			t & 16777232 ? vn(e) : _n(e), gn(e);
			var i = Rn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = jn;
		} finally {
			Dn = r, K = n;
		}
	}
}
function Q(e) {
	var t = (e.f & 2) != 0;
	if (En?.add(e), U !== null && !W && !(K !== null && K.f & 16384) && (J === null || !J.has(e))) {
		var n = U.deps;
		if (U.f & 2097152) e.rv < Mn && (e.rv = Mn, Y === null && n !== null && n[X] === e ? X++ : Y === null ? Y = [e] : Y.push(e));
		else {
			U.deps ??= [], i.call(U.deps, e) || U.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [U] : i.call(r, U) || r.push(U);
		}
	}
	if (H && P.has(e)) return P.get(e);
	if (t) {
		var a = e;
		if (H) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || Un(a)) && (o = pt(a)), P.set(a, o), o;
		}
		var s = (a.f & 512) == 0 && !W && U !== null && (Dn || (U.f & 512) != 0), c = (a.f & x) === 0;
		In(a) && (s && (a.f |= 512), mt(a)), s && !c && (gt(a), Hn(a));
	}
	if (M?.has(e)) return M.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Hn(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (gt(t), Hn(t));
}
function Un(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (P.has(t) || t.f & 2 && Un(t)) return !0;
	return !1;
}
function Wn(e) {
	var t = W;
	try {
		return W = !0, e();
	} finally {
		W = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var Gn = Symbol("events"), Kn = /* @__PURE__ */ new Set(), qn = /* @__PURE__ */ new Set();
function Jn(e, t, n) {
	(t[Gn] ??= {})[e] = n;
}
function Yn(e) {
	for (var t = 0; t < e.length; t++) Kn.add(e[t]);
	for (var n of qn) n(e);
}
var Xn = null;
function Zn(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Xn = e;
	var o = 0, c = Xn === e && e[Gn];
	if (c) {
		var l = i.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[Gn] = t;
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
		var d = U, f = K;
		G(null), q(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[Gn]?.[r];
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
			e[Gn] = t, delete e.currentTarget, G(d), q(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Qn = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function $n(e) {
	return Qn?.createHTML(e) ?? e;
}
function er(e) {
	var t = en("template");
	return t.innerHTML = $n(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function tr(e, t) {
	var n = K;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function nr(e, t) {
	var n = (t & 1) != 0, r = (t & 2) != 0, i, a = !e.startsWith("<!>");
	return () => {
		if (w) return tr(T, null), T;
		i === void 0 && (i = er(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ Yt(i)));
		var t = r || Gt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ Yt(t), s = t.lastChild;
			tr(o, s);
		} else tr(t, t);
		return t;
	};
}
function rr() {
	if (w) return tr(T, null), T;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = L();
	return e.append(t, n), tr(t, n), e;
}
function ir(e, t) {
	if (w) {
		var n = K;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = T), Ae();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var ar = ["touchstart", "touchmove"];
function or(e) {
	return ar.includes(e);
}
function sr(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[fe] ??= e.nodeValue) && (e[fe] = n, e.nodeValue = `${n}`);
}
function cr(e, t) {
	return dr(e, t);
}
function lr(t, n) {
	Jt(), n.intro = n.intro ?? !1;
	let r = n.target, i = w, a = T;
	try {
		for (var o = /* @__PURE__ */ Yt(r); o && (o.nodeType !== 8 || o.data !== "[");) o = /* @__PURE__ */ R(o);
		if (!o) throw e;
		ke(!0), E(o);
		let i = dr(t, {
			...n,
			anchor: o
		});
		return ke(!1), i;
	} catch (i) {
		if (i instanceof Error && i.message.split("\n").some((e) => e.startsWith("https://svelte.dev/e/"))) throw i;
		return i !== e && console.warn("Failed to hydrate: ", i), n.recover === !1 && be(), Jt(), Qt(r), ke(!1), cr(t, n);
	} finally {
		ke(i), E(a);
	}
}
var ur = /* @__PURE__ */ new Map();
function dr(t, { target: n, anchor: r, props: i = {}, events: o, context: s, intro: c = !0, transformError: l }) {
	Jt();
	var u = void 0, d = un(() => {
		var c = r ?? n.appendChild(L());
		tt(c, { pending: () => {} }, (n) => {
			ze({});
			var r = D;
			if (s && (r.c = s), o && (i.$$events = o), w && tr(n, null), u = t(n, i) || {}, w && (K.nodes.end = T, T === null || T.nodeType !== 8 || T.data !== "]")) throw De(), e;
			Be();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = or(r);
					for (let e of [n, document]) {
						var a = ur.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), ur.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Zn, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(a(Kn)), qn.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = ur.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Zn), t.delete(e), t.size === 0 && ur.delete(r)) : t.set(e, i);
			}
			qn.delete(f), c !== r && c.parentNode?.removeChild(c);
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
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function mr(e, t, n) {
	for (var r = [], i = t.length, o, s = t.length, c = 0; c < i; c++) {
		let n = t[c];
		xn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					hr(e, a(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = r.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			Qt(d), d.append(u), e.items.clear();
		}
		hr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function hr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ne, Tn(a, document.createDocumentFragment())) : V(t[i], n);
	}
}
var gr;
function _r(e, t, r, i, o, s = null) {
	var c = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		c = w ? E(/* @__PURE__ */ Yt(u)) : u.appendChild(L());
	}
	w && Ae();
	var d = null, f = /* @__PURE__ */ dt(() => {
		var e = r();
		return n(e) ? e : e == null ? [] : a(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, yr(v, p, c, t, i), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ne, xr(d, null, c)) : Cn(d) : xn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: hn(() => {
			p = Q(f);
			var e = p.length;
			let n = !1;
			w && Pe(c) === "[!" != (e === 0) && (c = Ne(), E(c), ke(!1), n = !0);
			for (var a = /* @__PURE__ */ new Set(), u = j, v = $t(), y = 0; y < e; y += 1) {
				w && T.nodeType === 8 && T.data === "]" && (c = T, n = !0, ke(!1));
				var b = p[y], x = i(b, y), S = h ? null : l.get(x);
				S ? (S.v && zt(S.v, b), S.i && zt(S.i, y), v && u.unskip_effect(S.e)) : (S = br(l, h ? c : gr ??= L(), b, x, y, o, t, r), h || (S.e.f |= ne), l.set(x, S)), a.add(x);
			}
			if (e === 0 && s && !d && (h ? d = B(() => s(c)) : (d = B(() => s(gr ??= L())), d.f |= ne)), e > a.size && he("", "", ""), w && e > 0 && E(Ne()), !h) if (m.set(u, a), v) {
				for (let [e, t] of l) a.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			n && ke(!0), Q(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, w && (c = T);
}
function vr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function yr(e, t, n, r, i) {
	var o = (r & 8) != 0, s = t.length, c = e.items, l = vr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = i(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = i(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Cn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ne, _ === l) xr(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), $(e, d, _), $(e, _, y), xr(_, y, n), d = _, p = [], m = [], l = vr(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], ee = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) xr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					$(e, S.prev, ee.next), $(e, d, S), $(e, ee, b), l = b, d = ee, --v, p = [], m = [];
				} else u.delete(_), xr(_, l, n), $(e, _.prev, _.next), $(e, _, d === null ? e.effect.first : d.next), $(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = vr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = vr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (hr(e, a(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var C = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || C.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && C.push(l), l = vr(l.next);
		var te = C.length;
		if (te > 0) {
			var re = r & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.fix();
			}
			mr(e, C, re);
		}
	}
	o && O(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function br(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Lt(n) : /* @__PURE__ */ Rt(n, !1, !1) : null, l = o & 2 ? Lt(i) : null;
	return {
		v: c,
		i: l,
		e: B(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function xr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ R(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function $(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/css.js
function Sr(e, t) {
	dn(() => {
		var n = e.getRootNode(), r = n.host ? n : n.head ?? n.ownerDocument.head;
		if (!r.querySelector("#" + t.hash)) {
			let e = en("style");
			e.id = t.hash, e.textContent = t.code, r.appendChild(e);
		}
	});
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var Cr = [..." 	\n\r\f\xA0\v﻿"];
function wr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Cr.includes(r[o - 1])) && (s === r.length || Cr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Tr(e, t, n, r, i, a) {
	var o = e[ue];
	if (w || o !== n || o === void 0) {
		var s = wr(n, r, a);
		(!w || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ue] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Er(e, t) {
	return e === t || e?.[se] === t;
}
function Dr(e = {}, t, n, r) {
	var i = D.r, a = K;
	return dn(() => {
		var o, s;
		return pn(() => {
			o = s, s = r?.() || [], Wn(() => {
				Er(n(...s), e) || (t(e, ...s), o && Er(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Er(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function Or(e, t, n, r) {
	var i = !0, a = (n & 8) != 0, o = (n & 16) != 0, s = r, l = !0, u = void 0, d = () => o && i ? (u ??= /* @__PURE__ */ st(r), Q(u)) : (l && (l = !1, s = o ? Wn(r) : r), s);
	let f;
	if (a) {
		var p = se in e || ce in e;
		f = c(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = Ze(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && xe(t), f(m)));
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
	var v = !1, y = (n & 1 ? st : dt)(() => (v = !1, g()));
	a && Q(y);
	var b = K;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? Q(y) : i && a ? Ut(e) : e;
			return I(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return H && v || b.f & 16384 ? y.v : Q(y);
	});
}
//#endregion
//#region node_modules/svelte/src/legacy/legacy-client.js
function kr(e) {
	return new Ar(e);
}
var Ar = class {
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
				return r === ce ? !0 : (Q(t.get(r) ?? n(r, Reflect.get(e, r))), Reflect.has(e, r));
			},
			set(e, r, i) {
				return I(t.get(r) ?? n(r, i), i), Reflect.set(e, r, i);
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
		}), (!e?.props?.$$host || e.sync === !1) && Dt(), this.#e = r.$$events;
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
}, jr;
typeof HTMLElement == "function" && (jr = class extends HTMLElement {
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
					let n = en("slot");
					e !== "default" && (n.name = e), ir(t, n);
				};
			}
			let t = {}, n = Nr(this);
			for (let r of this.$$s) r in n && (r === "default" && !this.$$d.children ? (this.$$d.children = e(r), t.default = !0) : t[r] = e(r));
			for (let e of this.attributes) {
				let t = this.$$g_p(e.name);
				t in this.$$d || (this.$$d[t] = Mr(t, e.value, this.$$p_d, "toProp"));
			}
			for (let e in this.$$p_d) !(e in this.$$d) && this[e] !== void 0 && (this.$$d[e] = this[e], delete this[e]);
			this.$$c = kr({
				component: this.$$ctor,
				target: this.$$shadowRoot || this,
				props: {
					...this.$$d,
					$$slots: t,
					$$host: this
				}
			}), this.$$me = ln(() => {
				pn(() => {
					this.$$r = !0;
					for (let e of o(this.$$c)) {
						if (!this.$$p_d[e]?.reflect) continue;
						this.$$d[e] = this.$$c[e];
						let t = Mr(e, this.$$d[e], this.$$p_d, "toAttribute");
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
		this.$$r || (e = this.$$g_p(e), this.$$d[e] = Mr(e, n, this.$$p_d, "toProp"), this.$$c?.$set({ [e]: this.$$d[e] }));
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
function Mr(e, t, n, r) {
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
function Nr(e) {
	let t = {};
	return e.childNodes.forEach((e) => {
		t[e.slot || "default"] = !0;
	}), t;
}
function Pr(e, t, n, r, i, a) {
	let l = class extends jr {
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
				n = Mr(e, n, t), this.$$d[e] = n;
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
var Fr = [
	"system",
	"light",
	"dark",
	"forest",
	"ocean",
	"sepia",
	"halloween",
	"winter",
	"holiday"
];
function Ir(e) {
	if (e !== "system") return e;
	try {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function Lr(e) {
	let t = Ir(e);
	document.documentElement.setAttribute("data-theme", t);
	try {
		localStorage.setItem("wrn-theme", e);
	} catch {}
}
//#endregion
//#region src/Theme.svelte
var Rr = /* @__PURE__ */ nr("<button type=\"button\"> </button>"), zr = {
	hash: "svelte-dj4sck",
	code: ".wrn-theme-btn.svelte-dj4sck {padding:6px 14px;border:1px solid var(--wrn-theme-border, #e2ddd5);border-radius:var(--wrn-theme-radius, 6px);background:var(--wrn-theme-btn-bg, transparent);color:var(--wrn-theme-text, #21322b);cursor:pointer;font-size:13px;min-height:36px;transition:background 0.15s, color 0.15s, border-color 0.15s;}.wrn-theme-btn.svelte-dj4sck:hover {background:var(--wrn-theme-hover, #eaf4f0);}.wrn-theme-btn.is-active.svelte-dj4sck {background:var(--wrn-theme-active-bg, #0d9488);color:var(--wrn-theme-active-text, #fff);border-color:var(--wrn-theme-active-bg, #0d9488);}"
};
function Br(e, t) {
	ze(t, !0), Sr(e, zr);
	let n = Or(t, "theme", 15, "system");
	function r(e) {
		n(e), Lr(e);
	}
	sn(() => {
		if (n() !== "system") return;
		let e = window.matchMedia("(prefers-color-scheme: dark)"), t = () => Lr("system");
		return e.addEventListener("change", t), () => e.removeEventListener("change", t);
	}), sn(() => {
		try {
			let e = localStorage.getItem("wrn-theme");
			if (e && Fr.includes(e)) {
				n(e), Lr(e);
				return;
			}
		} catch {}
		Lr(n());
	});
	var i = {
		get theme() {
			return n();
		},
		set theme(e = "system") {
			n(e), Dt();
		}
	}, a = rr();
	return _r(Zt(a), 16, () => Fr, (e) => e, (e, t) => {
		let i = /* @__PURE__ */ ut(() => ({
			system: "System",
			light: "Light",
			dark: "Dark",
			forest: "Forest",
			ocean: "Ocean",
			sepia: "Sepia",
			halloween: "Halloween",
			winter: "Winter",
			holiday: "Holiday"
		})[t] ?? t);
		var a = Rr();
		let o;
		var s = Xt(a, !0);
		je(a), mn(() => {
			o = Tr(a, 1, "wrn-theme-btn svelte-dj4sck", null, o, { "is-active": n() === t }), sr(s, Q(i));
		}), Jn("click", a, () => r(t)), ir(e, a);
	}), ir(e, a), Be(i);
}
Yn(["click"]), Pr(Br, { theme: {} }, [], [], { mode: "open" });
//#endregion
//#region src/ThemeElement.svelte
var Vr = /* @__PURE__ */ nr("<div style=\"display:contents\"><!></div>");
function Hr(e, t) {
	ze(t, !0);
	let n = Or(t, "theme", 7, "system"), r;
	function i(e, t) {
		r?.dispatchEvent(new CustomEvent(e, {
			detail: t,
			bubbles: !0
		}));
	}
	sn(() => {
		try {
			let e = localStorage.getItem("wrn-theme");
			if (e && Fr.includes(e)) {
				n(e), Lr(e), i("wrn-theme-change", { theme: e });
				return;
			}
		} catch {}
	});
	var a = {
		get theme() {
			return n();
		},
		set theme(e = "system") {
			n(e), Dt();
		}
	}, o = Vr();
	return Br(Xt(o), {
		get theme() {
			return n();
		},
		set theme(e) {
			n(e);
		}
	}), je(o), Dr(o, (e) => r = e, () => r), ir(e, o), Be(a);
}
customElements.define("worn-theme", Pr(Hr, { theme: {} }, [], []));
//#endregion
export { Hr as default };
