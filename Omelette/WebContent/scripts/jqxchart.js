/*
jQWidgets v2.2.0 (2012-May-25)
Copyright (c) 2011-2012 jQWidgets.
License: http://jqwidgets.com/license/
 */
(function(a) {
	a.jqx.jqxWidget("jqxChart", "", {});
	a
			.extend(
					a.jqx._jqxChart.prototype,
					{
						createInstance : function(d) {
							if (!a.jqx.dataAdapter) {
								throw "jqxdata.js is not loaded";
								return
							}
							this._refreshOnDownloadComlete();
							this._internalRefresh();
							var c = this;
							this.host.bind("mousemove", function(f) {
								if (this.enabled == false) {
									return
								}
								f.preventDefault();
								var e = f.pageX || f.clientX || f.screenX;
								var h = f.pageY || f.clientY || f.screenY;
								var g = c.host.position();
								e -= g.left;
								h -= g.top;
								c.onmousemove(e, h)
							});
							if (this.element.style) {
								var b = false;
								if (this.element.style.width != null) {
									b |= this.element.style.width.toString()
											.indexOf("%") != -1
								}
								if (this.element.style.height != null) {
									b |= this.element.style.height.toString()
											.indexOf("%") != -1
								}
								if (b) {
									a(window).resize(function() {
										if (c.timer) {
											clearTimeout(c.timer)
										}
										var e = a.browser.msie ? 200 : 1;
										c.timer = setTimeout(function() {
											var f = c.enableAnimations;
											c.enableAnimations = false;
											c.refresh();
											c.enableAnimations = f
										}, e)
									})
								}
							}
						},
						_refreshOnDownloadComlete : function() {
							if (this.source instanceof a.jqx.dataAdapter) {
								var c = this;
								var d = this.source._options;
								if (d == undefined
										|| (d != undefined && !d.autoBind)) {
									this.source.autoSync = false;
									this.source.dataBind()
								}
								if (this.source.records.length == 0) {
									var b = function() {
										if (c.ready) {
											c.ready()
										}
										c.refresh()
									};
									this.source
											.unbindDownloadComplete(this.element.id);
									this.source.bindDownloadComplete(
											this.element.id, b)
								} else {
									if (c.ready) {
										c.ready()
									}
								}
								this.source
										.unbindBindingUpdate(this.element.id);
								this.source.bindBindingUpdate(this.element.id,
										function() {
											c.refresh()
										})
							}
						},
						defineInstance : function() {
							this.source = new Array();
							this.seriesGroups = new Array();
							this.categoryAxis = {}
						},
						propertyChangedHandler : function(b, c, e, d) {
							if (this.isInitialized == undefined
									|| this.isInitialized == false) {
								return
							}
							if (c == "source") {
								this._refreshOnDownloadComlete()
							}
							this.refresh()
						},
						_internalRefresh : function() {
							this.host.empty();
							this._renderData = new Array();
							var c = null;
							if (document.createElementNS) {
								c = new a.jqx.svgRenderer()
							} else {
								c = new a.jqx.vmlRenderer();
								this._isVML = true
							}
							if (!c.init(this.host)) {
								return
							}
							this.renderer = c;
							var b = this.renderer.getRect();
							this._render({
								x : 1,
								y : 1,
								width : b.width,
								height : b.height
							})
						},
						refresh : function() {
							this._internalRefresh()
						},
						_seriesTypes : [ "line", "stackedline",
								"stackedline100", "spline", "stackedspline",
								"stackedspline100", "stepline",
								"stackedstepline", "stackedstepline100",
								"area", "stackedarea", "stackedarea100",
								"splinearea", "stackedsplinearea",
								"stackedsplinearea100", "steparea",
								"stackedsteparea", "stackedsteparea100",
								"column", "stackedcolumn", "stackedcolumn100",
								"pie", "scatter", "bubble" ],
						_render : function(f) {
							this.renderer.clear();
							if (this._getDataLen() == 0) {
								return
							}
							var s = this.backgroundImage;
							if (s == undefined || s == "") {
								this.host.css({
									"background-image" : ""
								})
							} else {
								this.host
										.css({
											"background-image" : (s
													.indexOf("(") != -1 ? s
													: "url('" + s + "')")
										})
							}
							this._buildStats();
							var A = this.padding || {
								left : 5,
								top : 5,
								right : 5,
								bottom : 5
							};
							var n = this.renderer.rect(f.x, f.y, f.width - 1,
									f.height - 1);
							if (s == undefined || s == "") {
								this.renderer.setAttr(n, "fill",
										this.background || this.backgroundColor
												|| "white")
							} else {
								this.renderer.setAttr(n, "fill", "transparent")
							}
							if (this.showBorderLine != false) {
								var c = this.borderLineColor == undefined ? this.borderColor
										: this.borderLineColor;
								if (c == undefined) {
									c = "#888888"
								}
								var j = this.borderLineWidth;
								if (isNaN(j) || j < 0.5 || j > 10) {
									j = 1
								}
								this.renderer.setAttrs(n, {
									"stroke-width" : j,
									stroke : c
								})
							}
							var L = {
								x : A.left,
								y : A.top,
								width : f.width - A.left - A.right,
								height : f.height - A.top - A.bottom
							};
							this._paddedRect = L;
							var b = this.titlePadding || {
								left : 2,
								top : 2,
								right : 2,
								bottom : 2
							};
							if (this.title && this.title.length > 0) {
								var M = this.toThemeProperty(
										"jqx-chart-title-text", null);
								var B = this.renderer.measureText(this.title,
										0, {
											"class" : M
										});
								this.renderer.text(this.title, L.x + b.left,
										L.y + b.top, L.width
												- (b.left + b.right), B.height,
										0, {
											"class" : M
										}, true, "center", "center");
								L.y += B.height;
								L.height -= B.height
							}
							if (this.description && this.description.length > 0) {
								var l = this.toThemeProperty(
										"jqx-chart-title-description", null);
								var B = this.renderer.measureText(
										this.description, 0, {
											"class" : l
										});
								this.renderer.text(this.description, L.x
										+ b.left, L.y + b.top, L.width
										- (b.left + b.right), B.height, 0, {
									"class" : l
								}, true, "center", "center");
								L.y += B.height;
								L.height -= B.height
							}
							if (this.title || this.description) {
								L.y += (b.bottom + b.top);
								L.height -= (b.bottom + b.top)
							}
							var t = {
								x : L.x,
								y : L.y,
								width : L.width,
								height : L.height
							};
							var k = 0;
							var o = [];
							for ( var G = 0; G < this.seriesGroups.length; G++) {
								var D = this.seriesGroups[G].valueAxis;
								if (!D) {
									if (this.seriesGroups[G].type == "pie") {
										o.push(0);
										continue
									}
									throw "seriesGroup["
											+ G
											+ "] is missing valueAxis definition"
								}
								var z = D.axisSize;
								if (!z || z == "auto") {
									z = this._renderValueAxis(G, {
										x : 0,
										y : t.y,
										width : t.width,
										height : t.height
									}, true).width
								}
								if (G > 0 && z > 0) {
									k += 5
								}
								o.push(z);
								k += z
							}
							this._plotRect = t;
							var p = this.categoryAxis.axisSize;
							if (!p || p == "auto") {
								var v = this._renderCategoryAxis({
									x : 0,
									y : 0,
									width : 10000000,
									height : 0
								}, true);
								p = v.height
							}
							var J = (this.showLegend != false);
							var C = !J || this.legendLayout ? {
								width : 0,
								height : 0
							} : this._renderLegend(L, true);
							if (L.height < p + C.height || L.width < k) {
								return
							}
							t.height -= p + C.height;
							t.x += k;
							t.width -= k;
							var F = this._isPieOnlySeries();
							if (!F) {
								var e = this.categoryAxis.tickMarksColor
										|| "#888888";
								if (k == 0) {
									var r = a.jqx._ptrnd(t.x);
									var m = this.renderer.line(r, a.jqx
											._ptrnd(t.y), r, a.jqx._ptrnd(t.y
											+ t.height + 5), {
										stroke : e,
										"stroke-width" : 1
									})
								}
								this._renderCategoryAxis({
									x : t.x,
									y : t.y + t.height,
									width : t.width,
									height : p
								}, false, t)
							}
							if (J) {
								var r = t.x
										+ a.jqx._ptrnd((t.width - C.width) / 2);
								var q = t.y + t.height + p;
								var z = t.width;
								var H = C.height;
								if (this.legendLayout) {
									r = this.legendLayout.left || r;
									q = this.legendLayout.top || q;
									z = this.legendLayout.width || z;
									H = this.legendLayout.height || H
								}
								if (r + z > L.x + L.width) {
									z = L.x + L.width - r
								}
								if (q + H > L.y + L.height) {
									H = L.y + L.height - q
								}
								this._renderLegend({
									x : r,
									y : q,
									width : z,
									height : H
								})
							}
							this._hasHorizontalLines = false;
							if (!F) {
								var O = t.x - k;
								for ( var G = 0; G < this.seriesGroups.length; G++) {
									var z = o[G];
									if (G > 0 && z > 0) {
										O += 5
									}
									this._renderValueAxis(G, {
										x : O,
										y : t.y,
										width : z,
										height : t.height
									}, false);
									this._hasHorizontalLines = this._hasHorizontalLines
											|| this._renderHorizontalGridLines(
													G, t);
									O += z
								}
							}
							if (t.width <= 0 || t.height <= 0) {
								return
							}
							this._plotRect = {
								x : t.x,
								y : t.y,
								width : t.width,
								height : t.height
							};
							var I = this.renderer.beginGroup();
							var K = this.renderer.createClipRect({
								x : t.x,
								y : t.y,
								width : t.width,
								height : t.height
							});
							this.renderer.setClip(I, K);
							for ( var G = 0; G < this.seriesGroups.length; G++) {
								var N = this.seriesGroups[G];
								var E = false;
								for ( var u in this._seriesTypes) {
									if (this._seriesTypes[u] == N.type) {
										E = true;
										break
									}
								}
								if (!E) {
									throw 'jqxChart: invalid series type "'
											+ N.type + '"';
									continue
								}
								if (N.type.indexOf("column") != -1) {
									this._renderColumnSeries(G, t)
								} else {
									if (N.type.indexOf("pie") != -1) {
										this._renderPieSeries(G, t)
									} else {
										if (N.type.indexOf("line") != -1
												|| N.type.indexOf("area") != -1) {
											this._renderLineSeries(G, t)
										} else {
											if (N.type == "scatter"
													|| N.type == "bubble") {
												this._renderScatterSeries(G, t)
											}
										}
									}
								}
							}
							this.renderer.endGroup();
							this._plotGroup = this.renderer._activeParent();
							if (this.enabled == false) {
								var d = this.renderer.rect(f.x, f.y, f.width,
										f.height);
								this.renderer.setAttrs(d, {
									fill : "#777777",
									opacity : 0.5,
									stroke : "#00FFFFFF"
								})
							}
						},
						_isPieOnlySeries : function() {
							if (this.seriesGroups.length == 0) {
								return false
							}
							for ( var b = 0; b < this.seriesGroups.length; b++) {
								if (this.seriesGroups[b].type != "pie") {
									return false
								}
							}
							return true
						},
						_renderChartLegend : function(v, c, d, e) {
							var n = {
								x : c.x + 3,
								y : c.y + 3,
								width : c.width - 6,
								height : c.height - 6
							};
							var j = {
								width : n.width,
								height : 0
							};
							var h = 0, g = 0;
							var f = 20;
							var b = 0;
							var o = 10;
							var u = 10;
							var s = 0;
							for ( var q = 0; q < v.length; q++) {
								var k = v[q].css;
								if (!k) {
									k = this.toThemeProperty(
											"jqx-chart-legend-text", null)
								}
								var l = v[q].text;
								var m = this.renderer.measureText(l, 0, {
									"class" : k
								});
								if (m.height > f) {
									f = m.height
								}
								if (m.width > s) {
									s = m.width
								}
								if (e) {
									if (q != 0) {
										g += f
									}
									if (g > n.height) {
										g = 0;
										h += s + u;
										s = m.width;
										j.width = h + s
									}
								} else {
									if (h != 0) {
										h += u
									}
									if (h + 2 * o + m.width > n.width
											&& m.width < n.width) {
										h = 0;
										g += f;
										f = 20;
										b = n.width;
										j.heigh = g + f
									}
								}
								if (!d) {
									var p = v[q].color;
									var t = this.renderer.rect(n.x + h, n.y + g
											+ o / 2, o, o);
									this.renderer.setAttrs(t, {
										fill : p,
										stroke : p,
										"stroke-width" : 1
									});
									this.renderer.text(l, n.x + h + 1.5 * o,
											n.y + g, m.width, f, 0, {
												"class" : k
											}, false, "center", "center")
								}
								if (e) {
								} else {
									h += m.width + 2 * o;
									if (b < h) {
										b = h
									}
								}
							}
							if (d) {
								j.height = a.jqx._ptrnd(g + f);
								j.width = a.jqx._ptrnd(b);
								return j
							}
						},
						_renderLegend : function(l, j) {
							var b = [];
							for ( var o = 0; o < this.seriesGroups.length; o++) {
								var f = this.seriesGroups[o];
								for ( var m = 0; m < f.series.length; m++) {
									var p = f.series[m];
									if (f.type == "pie") {
										var k = p.colorScheme || f.colorScheme
												|| this.colorScheme;
										var c = this._getDataLen(o);
										for ( var e = 0; e < c; e++) {
											var h = this._getDataValue(e,
													p.displayText, o);
											if (!h) {
												h = this._getFormattedValue(o,
														m, e)
											}
											var d = this
													._getColor(k, m * c + e);
											b.push({
												text : h,
												css : p.displayTextClass,
												color : d
											})
										}
										continue
									}
									var n = p.displayText || p.dataField || "";
									var d = this._getSeriesColor(o, m);
									b.push({
										text : n,
										css : p.displayTextClass,
										color : d
									})
								}
							}
							return this
									._renderChartLegend(
											b,
											l,
											j,
											(this.legendLayout && this.legendLayout.flow == "vertical"))
						},
						_renderCategoryAxis : function(f, h, j) {
							var t = {
								width : 0,
								height : 0
							};
							var g = this.categoryAxis;
							if (!g) {
								return t
							}
							var F = g.tickMarksColor || "#888888";
							var v = g.text;
							if (!h) {
								var r = a.jqx._ptrnd(f.y);
								var D = this.renderer.line(a.jqx._ptrnd(f.x),
										r, a.jqx._ptrnd(f.x + f.width + 1), r,
										{
											stroke : F,
											"stroke-width" : 1
										})
							}
							var u = g["class"];
							if (!u) {
								u = this.toThemeProperty("jqx-chart-axis-text",
										null)
							}
							var I = g.textRotationAngle || 0;
							var m = this._calculateXOffsets(undefined, f);
							var k = m.itemWidth;
							var B = g.unitInterval;
							if (isNaN(B)) {
								B = Math.max(1, Math.round(m.rangeLength / 10))
							}
							var K = this.categoryAxis.horizontalTextAlignment;
							var p = this._alignValuesWithTicks();
							var l = this.renderer.getRect();
							var b = l.width - f.x - f.width;
							var A = [];
							if (g.type != "date") {
								var E = m.customRange != false;
								var n = B;
								for ( var G = m.min; G <= m.max; G += n) {
									if (E || g.dataField == undefined
											|| g.dataField == "") {
										value = G
									} else {
										var z = Math.round(G);
										value = this._getDataValue(z,
												g.dataField)
									}
									var v = this._formatValue(value,
											g.formatSettings, g.formatFunction);
									if (v == undefined) {
										v = !E ? value.toString() : (G)
												.toString()
									}
									A.push(v);
									if (G + n > m.max) {
										n = m.max - G;
										if (n <= B / 2) {
											break
										}
									}
								}
							} else {
								var d = this._getDatesArray(m.min, m.max,
										g.baseUnit, p);
								for ( var G = 0; G < d.length; G += B) {
									A
											.push(this._formatValue(d[G],
													g.formatSettings,
													g.formatFunction))
								}
							}
							var s = 0;
							var C = p ? -k / 2 : 0;
							for ( var G = 0; G < A.length; G++, s += k) {
								var v = A[G];
								var w;
								if (h || G == m.max || p) {
									w = this.renderer.measureText(v, I, {
										"class" : u
									});
									if (w.height > t.height) {
										t.height = w.height
									}
								}
								if (p) {
									K = "center"
								}
								if (!h && (!w || s + w.width + C < f.width + b)) {
									this.renderer
											.text(v, f.x + s + C, f.y + 0, k,
													f.height, I, {
														"class" : u
													}, true, K,
													g.verticalTextAlignment)
								}
							}
							var c = {};
							if (!h) {
								var e = g.showGridLines != false;
								var H = g.gridLinesColor || "#888888";
								var J = g.gridLinesInterval || g.unitInterval;
								if (isNaN(J)) {
									J = B
								}
								for ( var G = 0; G <= m.rangeLength + J; G += J) {
									var D = a.jqx._ptrnd(f.x + G * f.width
											/ (m.rangeLength));
									if (D > f.x + f.width) {
										break
									}
									if (e
											|| (G == m.rangeLength && this._hasHorizontalLines)) {
										this.renderer.line(D,
												a.jqx._ptrnd(j.y), D,
												a.jqx._ptrnd(j.y + j.height), {
													stroke : H,
													"stroke-width" : 1
												});
										c[D] = true
									}
								}
							}
							var o = g.showTickMarks != false;
							if (!h && o) {
								var q = g.tickMarksInterval || g.unitInterval;
								if (isNaN(q)) {
									q = B
								}
								for ( var G = 0; G <= m.rangeLength + q; G += q) {
									var D = a.jqx._ptrnd(f.x + G * f.width
											/ (m.rangeLength));
									if (c[D - 1]) {
										D--
									} else {
										if (c[D + 1]) {
											D++
										}
									}
									if (D > f.x + f.width) {
										break
									}
									this.renderer.line(D, f.y, D, f.y + 4, {
										stroke : F,
										"stroke-width" : 1
									})
								}
							}
							t.width = a.jqx._rup(t.width);
							t.height = a.jqx._rup(t.height + 5);
							return t
						},
						_renderValueAxis : function(j, c, h) {
							var F = this.seriesGroups[j];
							var d = F.valueAxis;
							var s = {
								width : 0,
								height : 0
							};
							if (this._isPieOnlySeries()) {
								if (h) {
									return s
								}
								return
							}
							var o = this._stats.seriesGroups[j];
							if (!o || !o.isValid || false == d.displayValueAxis) {
								if (h) {
									return s
								}
								return
							}
							var k = d.tickMarksColor || "#888888";
							var e = F.type.indexOf("stacked") != -1
									&& F.type.indexOf("100") != -1;
							var m = d.showTickMarks;
							if (m == undefined) {
								m = true
							}
							var q = c.x + c.width;
							q = a.jqx._ptrnd(q);
							if (m && !h) {
								this.renderer.line(q, c.y, q, c.y + c.height
										+ 5, {
									stroke : k,
									"stroke-width" : 1
								})
							}
							if (d.description) {
								var l = d.descriptionClass;
								if (!l) {
									l = this.toThemeProperty(
											"jqx-chart-axis-description", null)
								}
								var v = this.renderer.measureText(
										d.description, -90, {
											"class" : l
										});
								if (h) {
									s.width += v.width + 5
								} else {
									this.renderer.text(d.description, c.x + 2,
											c.y, c.width - 5, c.height, -90, {
												"class" : l
											}, true, "left", "center");
									c.x += v.width + 5;
									c.width -= v.width + 5
								}
							}
							var b = d.dataField;
							var u = o.intervals;
							var C = o.min;
							var z = o.mu;
							var w = c.height / u;
							var r = d.itemsClass;
							if (!r) {
								r = this.toThemeProperty("jqx-chart-axis-text",
										null)
							}
							var n = c.y + c.height - w;
							var E = d.formatSettings;
							if (e && !E) {
								E = {
									sufix : "%"
								}
							}
							var f = 0;
							var G = d.textRotationAngle || 0;
							for ( var D = 0; D <= u; D++) {
								var A = C + D * z;
								var t = this._formatNumber(A, E);
								if (h) {
									var v = this.renderer.measureText(t, G, {
										"class" : r
									});
									if (f < v.width) {
										f = v.width
									}
								} else {
									var H = this.renderer.text(t, c.x, n + w
											/ 2, c.width - 4, w, G, {
										"class" : r
									}, false, "center", "center")
								}
								n -= w
							}
							if (h) {
								s.width += f + 5 + (m ? 3 : 0);
								s.height = a.jqx._rup(c.height);
								s.width = a.jqx._rup(s.width);
								return s
							}
							if (m == undefined || m) {
								var B = c.height / o.tickMarksIntervals;
								n = c.y;
								while (n < c.y + c.height) {
									var p = a.jqx._ptrnd(n);
									this.renderer.line(q - 3, p, q, p, {
										stroke : k,
										"stroke-width" : 1
									});
									n += B
								}
							}
						},
						_renderHorizontalGridLines : function(k, j) {
							var d = this.seriesGroups[k].valueAxis;
							if (!d || d.showGridLines == false) {
								return false
							}
							var b = d.gridLinesColor || d.tickMarksColor
									|| "#888888";
							var f = this._stats.seriesGroups[k];
							if (!f || !f.isValid || false == d.displayValueAxis
									|| false == d.showGridLines) {
								return false
							}
							var g = f.gridLinesIntervals;
							var h = j.height / g;
							var e = j.y;
							var c = h;
							while (e < j.y + j.height + 1) {
								var i = a.jqx._ptrnd(e);
								this.renderer.line(a.jqx._ptrnd(j.x), i, a.jqx
										._ptrnd(j.x + j.width), i, {
									stroke : b,
									"stroke-width" : 1
								});
								if (e + c > j.y + j.height) {
									c = j.y + j.height - e
								}
								if (c == 0) {
									break
								}
								e += c
							}
							return true
						},
						_buildStats : function() {
							var E = {
								seriesGroups : new Array()
							};
							this._stats = E;
							for ( var A = 0; A < this.seriesGroups.length; A++) {
								var n = this.seriesGroups[A];
								E.seriesGroups[A] = {};
								var d = E.seriesGroups[A];
								d.isValid = true;
								var b = n.valueAxis != undefined;
								var o = -1 != n.type.indexOf("stacked");
								var f = o && -1 != n.type.indexOf("100");
								if (f) {
									d.psums = new Array();
									d.nsums = new Array()
								}
								var c = NaN, e = NaN;
								var C = NaN, F = NaN;
								var B = n.baselineValue || 0;
								var z = this._getDataLen(A);
								var l = 0;
								for ( var y = 0; y < z && d.isValid; y++) {
									var v = b ? n.valueAxis.minValue : 0;
									var x = b ? n.valueAxis.maxValue : 0;
									var j = 0, k = 0;
									if (typeof (v) != "number") {
										v = NaN
									}
									if (typeof (x) != "number") {
										x = NaN
									}
									for ( var t = 0; t < n.series.length; t++) {
										var G = this._getDataValueAsNumber(y,
												n.series[t].dataField, A);
										if (isNaN(G)) {
											throw "jqxChart: Data source contains invalid value at Index: "
													+ y
													+ ", DataField: "
													+ n.series[t].dataField;
											d.isValid = false;
											break
										}
										if ((G > x || isNaN(x))
												&& ((!b || isNaN(n.valueAxis.maxValue)) ? true
														: G <= n.valueAxis.maxValue)) {
											x = G
										}
										if ((G < v || isNaN(v))
												&& ((!b || isNaN(n.valueAxis.minValue)) ? true
														: G >= n.valueAxis.minValue)) {
											v = G
										}
										if (G > B) {
											j += G
										} else {
											if (G < B) {
												k += G
											}
										}
									}
									var r = j - k;
									if (l < r) {
										l = r
									}
									if (f) {
										d.psums[y] = j;
										d.nsums[y] = k
									}
									if (x > e || isNaN(e)) {
										e = x
									}
									if (v < c || isNaN(c)) {
										c = v
									}
									if (j > C || isNaN(C)) {
										C = j
									}
									if (k < F || isNaN(F)) {
										F = k
									}
								}
								if (f) {
									C = C == 0 ? 0 : Math.max(C, -F);
									F = F == 0 ? 0 : Math.min(F, -C)
								}
								var u = b ? n.valueAxis.unitInterval : 0;
								if (!u) {
									u = o ? (C - F) / 10 : (e - c) / 10
								}
								var m = b ? n.valueAxis.tickMarksInterval || u
										: 0;
								var D = b ? n.valueAxis.gridLinesInterval || u
										: 0;
								if (c < F) {
									F = c
								}
								if (e > C) {
									C = e
								}
								var w = a.jqx._rnd(o ? F : c, u, false);
								var q = a.jqx._rnd(o ? C : e, u, true);
								if (f) {
									q = (q > 0) ? 100 : 0;
									w = (w < 0) ? -100 : 0;
									u = b ? n.valueAxis.unitInterval : 10;
									if (u <= 0 || u >= 100) {
										u = 10
									}
									if (m <= 0 || m >= 100) {
										m = 10
									}
									if (D <= 0 || D >= 100) {
										D = 10
									}
								}
								if (isNaN(q) || isNaN(w) || isNaN(u)) {
									continue
								}
								var h = (q - w) / (u == 0 ? 1 : u);
								if (h < 1) {
									continue
								}
								var p = q - w;
								d.rmax = o ? C : e;
								d.rmin = o ? F : c;
								d.min = w;
								d.max = q;
								d.mu = u;
								d.maxRange = l;
								d.intervals = h;
								d.tickMarksInterval = m;
								d.tickMarksIntervals = m == 0 ? 0 : p / m;
								d.gridLinesInterval = D;
								d.gridLinesIntervals = D == 0 ? 0 : p / D;
								if (p == 0) {
									p = 1
								}
								d.scale = o ? (C - F) / p : (e - c) / p
							}
						},
						_getDataLen : function(c) {
							var b = this.source;
							if (c != undefined && c != -1
									&& this.seriesGroups[c].source) {
								b = this.seriesGroups[c].source
							}
							if (b instanceof a.jqx.dataAdapter) {
								b = b.records
							}
							if (b) {
								return b.length
							}
							return 0
						},
						_getDataValue : function(b, e, d) {
							var c = this.source;
							if (d != undefined && d != -1) {
								c = this.seriesGroups[d].source || c
							}
							if (c instanceof a.jqx.dataAdapter) {
								c = c.records
							}
							if (!c || b < 0 || b > c.length - 1) {
								return NaN
							}
							return (e && e != "") ? c[b][e] : c[b]
						},
						_getDataValueAsNumber : function(b, e, c) {
							var d = this._getDataValue(b, e, c);
							if (this._isDate(d)) {
								return d.valueOf()
							}
							if (typeof (d) != "number") {
								d = parseFloat(d)
							}
							if (typeof (d) != "number") {
								d = undefined
							}
							return d
						},
						_renderPieSeries : function(c, D) {
							var m = this._getDataLen(c);
							var q = this.seriesGroups[c];
							for ( var f = 0; f < q.series.length; f++) {
								var J = q.series[f];
								var p = J.colorScheme || q.colorScheme
										|| this.colorScheme;
								var g = J.initialAngle || 0;
								var M = g;
								var K = J.radius || Math.min(D.width, D.height)
										* 0.4;
								var d = J.centerOffset || 0;
								var I = J.offsetX || D.width / 2;
								var G = J.offsetX || D.height / 2;
								var E = this._getAnimProps(c, f);
								var v = E.enabled && m < 5000
										&& this._isVML != true ? E.duration : 0;
								var l = 0;
								var n = 0;
								for ( var O = 0; O < m; O++) {
									var A = this._getDataValueAsNumber(O,
											J.dataField, c);
									if (typeof (A) != "number") {
										continue
									}
									if (A > 0) {
										l += A
									} else {
										n += A
									}
								}
								var k = l - n;
								if (k == 0) {
									k = 1
								}
								for ( var O = 0; O < m; O++) {
									var A = this._getDataValueAsNumber(O,
											J.dataField, c);
									if (typeof (A) != "number") {
										continue
									}
									var o = Math.round(Math.abs(A) / k * 360);
									if (O + 1 == m) {
										o = 360 + g - M
									}
									var H = D.x + I;
									var F = D.y + G;
									var L = this.renderer.pieslice(H, F, K, M,
											v > 0 ? M : M + o, d);
									if (v > 0) {
										var r = {
											x : H,
											y : F,
											r : K,
											fromAngle : M,
											toAngle : M + o,
											centerOffset : d
										};
										var j = this;
										this
												._animate(
														L,
														undefined,
														v,
														function(x, i, y) {
															var s = i.fromAngle
																	+ y
																	* (i.toAngle - i.fromAngle);
															var Q = j.renderer
																	._getPieSlicePath(
																			i.x,
																			i.y,
																			i.r,
																			i.fromAngle,
																			s,
																			i.centerOffset);
															j.renderer
																	.setAttrs(
																			x,
																			{
																				d : Q
																			})
														}, r)
									}
									var B = this._getColor(p, f * m + O);
									this.renderer.setAttrs(L, {
										fill : B,
										stroke : B,
										"stroke-width" : 1
									});
									var t = M, N = M + o;
									var z = Math.abs(t - N);
									var P = z > 180 ? 1 : 0;
									if (z > 360) {
										t = 0;
										N = 360
									}
									var e = t * Math.PI * 2 / 360;
									var u = N * Math.PI * 2 / 360;
									var C = z / 2 + t;
									var b = C * Math.PI * 2 / 360;
									var h = this._showLabel(c, f, O, {
										x : 0,
										y : 0,
										width : 0,
										height : 0
									}, "left", "top", true);
									var w = J.labelRadius || K
											+ Math.max(h.width, h.height);
									w += d;
									var H = a.jqx._ptrnd(D.x + I + w
											* Math.cos(b) - h.width / 2);
									var F = a.jqx._ptrnd(D.y + G - w
											* Math.sin(b) - h.height / 2);
									this._showLabel(c, f, O, {
										x : H,
										y : F,
										width : h.width,
										height : h.height
									}, "left", "top");
									this._installHandlers(L, c, f, O);
									M += o
								}
							}
						},
						_renderColumnSeries : function(e, c) {
							var q = this.seriesGroups[e];
							if (!q.series || q.series.length == 0) {
								return
							}
							var r = q.type.indexOf("stacked") != -1;
							var d = r && q.type.indexOf("100") != -1;
							var p = this._getDataLen(e);
							var L = q.columnsGapPercent;
							if (isNaN(L) || L < 0 || L > 100) {
								L = 25
							}
							var A = q.seriesGapPercent;
							if (isNaN(A) || A < 0 || A > 100) {
								A = 10
							}
							var z = this._calcGroupOffsets(e, c);
							if (!z || z.xoffsets.length == 0) {
								return
							}
							for ( var B = 0; B < q.series.length; B++) {
								var w = q.series[B];
								var D = w.dataField;
								var u = this._getColors(e, B, undefined, this
										._getGroupGradientType(e));
								var f = w.opacity || q.opacity;
								if (!f || f < 0 || f > 1) {
									f = 1
								}
								var C = this._getAnimProps(e, B);
								var b = C.enabled && z.xoffsets.length < 100 ? C.duration
										: 0;
								var o = this._alignValuesWithTicks(e);
								for ( var E = z.xoffsets.first; E <= z.xoffsets.last; E++) {
									var M = this._getDataValueAsNumber(E, D, e);
									if (typeof (M) != "number") {
										continue
									}
									var H = z.xoffsets.data[E];
									if (o) {
										H -= z.xoffsets.itemWidth / 2
									}
									var G = H + z.xoffsets.itemWidth;
									var l = (G - H + 1);
									var K = (G - H + 1) / (1 + L / 100);
									var n = (!r && q.series.length > 1) ? (K
											* A / 100)
											/ (q.series.length - 1) : 0;
									var J = (K - n * (q.series.length - 1));
									if (K < 1) {
										K = 1
									}
									var j = 0;
									if (!r && q.series.length > 1) {
										J /= q.series.length;
										j = B
									}
									var v = H + (l - K) / 2 + j * (n + J);
									if (j == q.series.length) {
										J = l - H + K - v
									}
									var t = z.offsets[B][E].to;
									var k = z.offsets[B][E].from;
									var g = z.baseOffset;
									var F = k - t;
									if (Math.abs(F) < 1) {
										continue
									}
									var m = {
										x : c.x + v,
										y : F > 0 ? t : k,
										width : J,
										height : Math.abs(F)
									};
									var I;
									if (!r) {
										if (b == 0) {
											I = this.renderer.rect(m.x, m.y,
													m.width, m.height)
										} else {
											I = this.renderer.rect(m.x, m.y
													+ m.height, m.width, 0);
											if (F > 0) {
												this._animate(I, [ {
													key : "y",
													type : "point",
													from : m.y + m.height,
													to : m.y
												}, {
													key : "height",
													type : "point",
													from : 0,
													to : m.height
												} ], b, undefined, undefined)
											} else {
												this.renderer.setAttrs(I, {
													y : m.y
												});
												this._animate(I, [ {
													key : "height",
													type : "point",
													from : 0,
													to : -F
												} ], b)
											}
										}
									} else {
										if (b == 0) {
											I = this.renderer.rect(m.x, m.y, J,
													m.height)
										} else {
											I = this.renderer.rect(m.x, m.y, 0,
													m.height);
											this._animate(I, [ {
												key : "width",
												type : "point",
												from : 0,
												to : J
											} ], b)
										}
									}
									this.renderer.setAttrs(I, {
										fill : u.fillColor,
										"fill-opacity" : f,
										stroke : u.lineColor,
										"stroke-width" : 1
									});
									this._installHandlers(I, e, B, E);
									this._showLabel(e, B, E, m)
								}
							}
						},
						_renderScatterSeries : function(e, d) {
							var k = this.seriesGroups[e];
							if (!k.series || k.series.length == 0) {
								return
							}
							var c = k.type == "bubble";
							var u = this._calcGroupOffsets(e, d);
							if (!u || u.xoffsets.length == 0) {
								return
							}
							var j = this._alignValuesWithTicks(e);
							for ( var w = 0; w < k.series.length; w++) {
								var n = this._getColors(e, w, undefined, this
										._getGroupGradientType(e));
								var p = k.series[w];
								var B = p.dataField;
								var f = p.opacity || k.opacity;
								if (!f || f < 0 || f > 1) {
									f = 1
								}
								var z = NaN, C = NaN;
								if (c) {
									for ( var D = u.xoffsets.first; D <= u.xoffsets.last; D++) {
										var G = this._getDataValueAsNumber(D,
												p.radiusDataField, e);
										if (typeof (G) != "number") {
											throw "Invalid radiusDataField value at ["
													+ D + "]"
										}
										if (isNaN(z) || G < z) {
											z = G
										}
										if (isNaN(C) || G > C) {
											C = G
										}
									}
								}
								var l = p.minRadius;
								if (isNaN(l)) {
									l = d.width / 50
								}
								var h = p.maxRadius;
								if (isNaN(h)) {
									h = d.width / 25
								}
								if (l > h) {
									throw "Invalid settings: minRadius must be less than or equal to maxRadius"
								}
								var g = p.radius || 5;
								var A = this._getAnimProps(e, w);
								var b = A.enabled && u.xoffsets.length < 5000 ? A.duration
										: 0;
								for ( var D = u.xoffsets.first; D <= u.xoffsets.last; D++) {
									var G = this._getDataValueAsNumber(D, B, e);
									if (typeof (G) != "number") {
										continue
									}
									var o = u.xoffsets.data[D];
									o = a.jqx._ptrnd(d.x + o);
									var m = u.offsets[w][D].to;
									var q = g;
									if (c) {
										var F = this._getDataValueAsNumber(D,
												p.radiusDataField, e);
										if (typeof (F) != "number") {
											continue
										}
										q = l + (h - l) * (F - z)
												/ Math.max(1, C - z);
										if (isNaN(q)) {
											q = l
										}
									}
									var E = this.renderer.circle(o, m,
											b == 0 ? q : 0);
									this.renderer.setAttrs(E, {
										fill : n.fillColor,
										"fill-opacity" : f,
										stroke : n.lineColor,
										"stroke-width" : 1
									});
									var v = {
										from : 0,
										to : q
									};
									var t = this;
									if (b > 0) {
										this._animate(E, undefined, b,
												function(r, i, s) {
													t._animR(r, i, s)
												}, v)
									}
									this._installHandlers(E, e, w, D)
								}
							}
						},
						_animR : function(c, b, e) {
							var d = Math.round((b.to - b.from) * e + b.from);
							if (this._isVML) {
								this.renderer.updateCircle(c, undefined,
										undefined, d)
							} else {
								this.renderer.setAttrs(c, {
									r : d
								})
							}
						},
						_showToolTip : function(j, g, r, p, c) {
							if (this.showToolTips == false) {
								return
							}
							if (this._toolTipElement
									&& r == this._toolTipElement.gidx
									&& p == this._toolTipElement.sidx
									&& c == this._toolTipElement.iidx) {
								return
							}
							this._hideToolTip();
							if (this._pointMarker) {
								j = parseInt(this.renderer.getAttr(
										this._pointMarker, "cx")) + 5;
								g = parseInt(this.renderer.getAttr(
										this._pointMarker, "cy")) - 5
							}
							var f = this.seriesGroups[r];
							var k = f.series[p];
							var e = k.toolTipFormatSettings
									|| f.toolTipFormatSettings;
							var o = k.toolTipFormatFunction
									|| f.toolTipFormatFunction;
							var h = this._getColors(r, p, c);
							var l = this._getFormattedValue(r, p, c, e, o);
							var b = this._getDataValue(c,
									this.categoryAxis.dataField, r);
							if (this.categoryAxis.dataField == undefined
									|| this.categoryAxis.dataField == "") {
								b = c
							}
							var u = this.categoryAxis.toolTipFormatSettings
									|| this.categoryAxis.formatSettings;
							var d = this.categoryAxis.toolTipFormatFunction
									|| this.categoryAxis.formatFunction;
							if (this.categoryAxis.type == "date") {
								b = this._castAsDate(b)
							}
							var v = this._formatValue(b, u, d);
							if (f.type != "pie") {
								l = (k.displayText || k.dataField || "") + ", "
										+ v + ": " + l
							} else {
								l = this._getDataValue(c, k.displayText
										|| k.dataField)
										+ ": " + l
							}
							var q = k.toolTipClass
									|| f.toolTipClass
									|| this.toThemeProperty(
											"jqx-chart-tooltip-text", null);
							var s = k.toolTipBackground || f.toolTipBackground
									|| "#FFFFFF";
							var t = k.toolTipLineColor || f.toolTipLineColor
									|| h.lineColor;
							var n = this.renderer.measureText(l, 0, {
								"class" : q
							});
							n.width = n.width + 5;
							n.height = n.height + 6;
							rect = this.renderer.getRect();
							j = Math.max(j - 5, rect.x);
							g = Math.max(g - n.height, rect.y);
							if (n.width > rect.width || n.height > rect.height) {
								return
							}
							if (j + n.width > rect.x + rect.width) {
								j = rect.x + rect.width - n.width - 2
							}
							if (g + n.height > rect.y + rect.height) {
								g = rect.y + rect.height - n.height - 2
							}
							var i = this.renderer.rect(j, g, n.width, n.height);
							this.renderer.setAttrs(i, {
								fill : s,
								"fill-opacity" : 0,
								stroke : t,
								rx : 2,
								ry : 2,
								"stroke-width" : 1
							});
							var m = this.renderer.text(l, j, g, n.width,
									n.height, 0, {
										"class" : q,
										opacity : 0
									}, true, "center", "center");
							this._toolTipElement = {
								box : i,
								txt : m,
								sidx : p,
								gidx : r,
								iidx : c
							};
							this._animate(i, [ {
								key : "fill-opacity",
								from : 0,
								to : 0.8
							} ], 200);
							this._animate(m, [ {
								key : "opacity",
								from : 0,
								to : 1
							} ], 500)
						},
						_hideToolTip : function() {
							if (!this._toolTipElement) {
								return
							}
							this.renderer
									.removeElement(this._toolTipElement.box);
							this.renderer
									.removeElement(this._toolTipElement.txt);
							this._toolTipElement = undefined
						},
						_showLabel : function(r, n, c, j, f, k, g) {
							var p = this.seriesGroups[r];
							var b = p.series[n];
							var i = {
								width : 0,
								height : 0
							};
							if (!b.showLabels && !p.showLabels) {
								return i
							}
							if (j.width < 0 || j.height < 0) {
								return i
							}
							var m = b.labelsAngle || p.labelsAngle || 0;
							var o = b.labelOffset || p.labelAngle || {
								x : 0,
								y : 0
							};
							var e = b.labelClass
									|| p.labelClass
									|| this.toThemeProperty(
											"jqx-chart-label-text", null);
							f = f || "center";
							k = k || "center";
							var q = this._getFormattedValue(r, n, c);
							var l = j.width;
							var d = j.height;
							if (l == 0 || d == 0 || g) {
								i = this.renderer.measureText(q, m, {
									"class" : e
								});
								if (g) {
									return i
								}
								l = i.width;
								d = i.height
							}
							var s = this.renderer.text(q, j.x + o.x, j.y + o.y,
									l, d, m, {}, m != 0, f, k);
							this.renderer.setAttrs(s, {
								"class" : e
							});
							if (this._isVML) {
								this.renderer.removeElement(s);
								this.renderer.getContainer()[0].appendChild(s)
							}
						},
						_getAnimProps : function(j, f) {
							var e = this.seriesGroups[j];
							var c = e.series[f];
							var b = this.enableAnimations == true;
							if (e.enableAnimations) {
								b = e.enableAnimations == true
							}
							if (c.enableAnimations) {
								b = c.enableAnimations == true
							}
							var i = this.animationDuration;
							if (isNaN(i)) {
								i = 1000
							}
							var d = e.animationDuration;
							if (!isNaN(d)) {
								i = d
							}
							var h = c.animationDuration;
							if (!isNaN(h)) {
								i = h
							}
							if (i > 5000) {
								i = 1000
							}
							return {
								enabled : b,
								duration : i
							}
						},
						_renderLineSeries : function(e, A) {
							var r = this.seriesGroups[e];
							if (!r.series || r.series.length == 0) {
								return
							}
							var l = r.type.indexOf("area") != -1;
							var w = r.type.indexOf("stacked") != -1;
							var b = w && r.type.indexOf("100") != -1;
							var M = r.type.indexOf("spline") != -1;
							var m = r.type.indexOf("step") != -1;
							if (m && M) {
								return
							}
							var n = this._getDataLen(e);
							var K = A.width / n;
							var q = Math.round(A.width / K);
							var d = Math.round(n / q);
							var o = this._calcGroupOffsets(e, A);
							if (!o || o.xoffsets.length == 0) {
								return
							}
							var C = this._alignValuesWithTicks(e);
							for ( var G = r.series.length - 1; G >= 0; G--) {
								var H = this._getColors(e, G, undefined, this
										._getGroupGradientType(e));
								var N = r.series[G].opacity || r.opacity;
								if (!N || N < 0 || N > 1) {
									N = 1
								}
								var t = r.series[G].lineWidth || r.lineWidth;
								if (!t || t == "auto" || isNaN(t) || t < 1
										|| t > 15) {
									t = l ? 2 : 3
								}
								var E = [];
								var z = -1;
								var j = 0;
								var B = NaN;
								var p = NaN;
								var O = NaN;
								if (o.xoffsets.length < 1) {
									continue
								}
								var D = this._getAnimProps(e, G);
								var y = D.enabled && o.xoffsets.length < 5000
										&& this._isVML != true ? D.duration : 0;
								for ( var L = o.xoffsets.first; L <= o.xoffsets.last; L++) {
									var F = o.xoffsets.data[L];
									if (F == undefined) {
										continue
									}
									var h = o.offsets[G][L].to;
									if (!l && b) {
										if (h <= A.y) {
											h = A.y + 1
										}
										if (h >= A.y + A.height) {
											h = A.y + A.height - 1
										}
									}
									F = Math.max(F, 1);
									j = F;
									if (m && !isNaN(B) && !isNaN(p)) {
										if (p != h) {
											E.push({
												x : A.x + j,
												y : a.jqx._ptrnd(p)
											})
										}
									}
									E.push({
										x : A.x + j,
										y : a.jqx._ptrnd(h)
									});
									B = j;
									p = h;
									if (isNaN(O)) {
										O = h
									}
									this._showLabel(e, G, L, {
										x : A.x + j,
										y : a.jqx._ptrnd(h),
										width : 0,
										height : 0
									})
								}
								var f = A.x + o.xoffsets.data[o.xoffsets.first];
								var I = A.x + o.xoffsets.data[o.xoffsets.last];
								if (l && r.alignEndPointsWithIntervals != false) {
									if (f > A.x) {
										f -= (f - A.x) % o.xoffsets.itemWidth
												+ 1
									}
									if (I < A.x + A.width) {
										I += o.xoffsets.itemWidth - (I - A.x)
												% o.xoffsets.itemWidth - 1
									}
								}
								var g = o.baseOffset;
								O = a.jqx._ptrnd(O);
								var c = a.jqx._ptrnd(h);
								var v = this._calculateLine(E, g, y == 0 ? 1
										: 0, l);
								v = this._buildLineCmd(v, f, I, O, c, g, l, M
										&& E.length > 3);
								var J = this.renderer.path(v, {
									"stroke-width" : t,
									stroke : H.lineColor,
									"fill-opacity" : N,
									fill : l ? H.fillColor : "none"
								});
								this._installHandlers(J, e, G);
								if (y > 0) {
									var u = {
										pointsArray : E,
										left : f,
										right : I,
										pyStart : O,
										pyEnd : c,
										yBase : g,
										isArea : l,
										isSpline : M
									};
									var k = this;
									this._animate(J, undefined, y, function(x,
											i, P) {
										var Q = k._calculateLine(i.pointsArray,
												i.yBase, P, i.isArea);
										var s = i.pointsArray.length;
										if (!i.isArea) {
											s = Math.round(s * P)
										}
										Q = k._buildLineCmd(Q, i.left, i.right,
												i.pyStart, i.pyEnd, i.yBase,
												i.isArea, s > 3 && i.isSpline);
										k.renderer.setAttrs(x, {
											d : Q
										})
									}, u)
								}
							}
						},
						_calculateLine : function(h, d, e, g) {
							var f = "";
							var c = h.length;
							if (!g) {
								c = Math.round(c * e)
							}
							for ( var b = 0; b < c; b++) {
								if (b > 0) {
									f += " "
								}
								var j = h[b].y;
								if (g) {
									j = a.jqx._ptrnd((j - d) * e + d)
								}
								f += h[b].x + "," + j
							}
							return f
						},
						_buildLineCmd : function(k, g, o, n, b, p, m, d) {
							var f = k;
							if (d) {
								f = this._getBezierPoints(k)
							}
							var l = f.split(" ");
							var j = l[0].replace("C", "");
							if (m) {
								var e = g + "," + n;
								var h = o + "," + b;
								var c = g + "," + p;
								var i = o + "," + p;
								f = "M "
										+ c
										+ " L "
										+ j
										+ (d ? "" : ("L " + j + " "))
										+ f
										+ (d ? (" L" + i + " M " + i) : (" "
												+ i + " " + c))
							} else {
								if (d) {
									f = "M " + j + " " + f
								} else {
									f = "M " + j + " L " + j + " " + f
								}
							}
							return f
						},
						_getColors : function(n, k, h, e) {
							var l = this.seriesGroups[n];
							if (l.type != "pie") {
								h = undefined
							}
							var i = l.series[k].useGradient || l.useGradient;
							if (i == undefined) {
								i = true
							}
							var g;
							if (!isNaN(h)) {
								var d = this._getDataLen(n);
								g = this._getColor(l.series[k].colorScheme
										|| l.colorScheme || this.colorScheme, k
										* d + h)
							} else {
								g = this._getSeriesColor(n, k)
							}
							var m = a.jqx._adjustColor(g, 1.1);
							var j = a.jqx._adjustColor(g, 0.9);
							var f = a.jqx._adjustColor(m, 0.9);
							var b = g;
							var c = m;
							if (i) {
								if (e == "verticalLinearGradient") {
									b = this.renderer._toLinearGradient(g,
											true, [ [ 0, 1 ], [ 100, 1.5 ] ]);
									c = this.renderer._toLinearGradient(m,
											true, [ [ 0, 1 ], [ 100, 1.5 ] ])
								} else {
									if (e == "horizontalLinearGradient") {
										b = this.renderer
												._toLinearGradient(g, false,
														[ [ 0, 1 ],
																[ 25, 1.1 ],
																[ 50, 1.5 ],
																[ 100, 1 ] ]);
										c = this.renderer
												._toLinearGradient(m, false,
														[ [ 0, 1 ],
																[ 25, 1.1 ],
																[ 50, 1.5 ],
																[ 100, 1 ] ])
									}
								}
							}
							return {
								baseColor : g,
								fillColor : b,
								lineColor : j,
								fillSelected : c,
								lineSelected : f
							}
						},
						_installHandlers : function(d, j, i, c) {
							var b = this;
							var h = this.seriesGroups[j];
							var e = this.seriesGroups[j].series[i];
							var f = h.type.indexOf("line") != -1
									|| h.type.indexOf("area") != -1;
							if (!f) {
								this.renderer.addHandler(d, "mousemove",
										function(g) {
											g.preventDefault();
											b._startTooltipTimer(j, i, c)
										})
							}
							this.renderer.addHandler(d, "mouseover",
									function(g) {
										g.preventDefault();
										b._select(d, j, i, c);
										if (f) {
											return
										}
										if (isNaN(c)) {
											return
										}
										b._raiseEvent("mouseover", h, e, c)
									});
							this.renderer.addHandler(d, "mouseout",
									function(g) {
										g.preventDefault();
										if (c != undefined) {
											b._cancelTooltipTimer()
										}
										if (f) {
											return
										}
										b._unselect();
										if (isNaN(c)) {
											return
										}
										b._raiseEvent("mouseout", h, e, c)
									});
							this.renderer.addHandler(d, "click", function(g) {
								g.preventDefault();
								if (f) {
									return
								}
								if (h.type.indexOf("column") != -1) {
									b._unselect()
								}
								if (isNaN(c)) {
									return
								}
								b._raiseEvent("click", h, e, c)
							})
						},
						_getHorizontalOffset : function(m, j, g) {
							var h = this._plotRect;
							var d = this._getDataLen(m);
							if (d == 0) {
								return {
									index : undefined,
									x : j
								}
							}
							var k = this._calcGroupOffsets(m, this._plotRect);
							if (k.xoffsets.length == 0) {
								return {
									index : undefined,
									x : undefined
								}
							}
							j -= h.x;
							var f = k.xoffsets.first;
							var l = k.xoffsets.last;
							if (j <= k.xoffsets.data[f]) {
								return {
									index : f,
									x : k.xoffsets.data[f]
								}
							}
							if (j >= k.xoffsets.data[l]) {
								return {
									index : l,
									x : k.xoffsets.data[l]
								}
							}
							for ( var e = f; e < l; e++) {
								var c = k.xoffsets.data[e];
								var b = k.xoffsets.data[e + 1];
								if (j > c && j < c + (b - c) / 2) {
									return {
										index : e,
										x : c
									}
								}
								if (j > c + (b - c) / 2 && j < b) {
									return {
										index : Math.min(e + 1, l),
										x : b
									}
								}
							}
							return {
								index : undefined,
								x : undefined
							}
						},
						onmousemove : function(l, j) {
							this._mouseX = l;
							this._mouseY = j;
							this._hideToolTip();
							if (!this._selected) {
								return
							}
							var k = this._plotRect;
							var b = this._paddedRect;
							if (l < b.x || l > b.x + b.width || j < b.y
									|| j > b.y + b.height) {
								this._unselect();
								return
							}
							var n = this._selected.group;
							var f = this.seriesGroups[n];
							var p = f.series[this._selected.series];
							var h = this.seriesGroups[n].type;
							var k = this._plotRect;
							if (h.indexOf("line") != -1
									|| h.indexOf("area") != -1) {
								var d = this._getHorizontalOffset(n, l, j);
								var e = d.index;
								if (e == undefined) {
									return
								}
								if (this._selected.item != e) {
									if (this._selected.item) {
										this._raiseEvent("mouseout", f, p,
												this._selected.item)
									}
									this._selected.item = e;
									this._raiseEvent("mouseover", f, p, e)
								}
								var m = this._calcGroupOffsets(n, k);
								j = m.offsets[this._selected.series][e].to;
								l = d.x;
								j = a.jqx._ptrnd(j);
								l = a.jqx._ptrnd(k.x + l);
								if (l < b.x || l > b.x + b.width
										&& this._pointMarker) {
									this.renderer
											.removeElement(this._pointMarker);
									this._pointMarker = undefined;
									return
								}
								l += 1;
								j -= 1;
								if (!this._pointMarker) {
									this._pointMarker = this.renderer.circle(l,
											j, 4);
									this._plotGroup
											.appendChild(this._pointMarker)
								}
								var c = this._getSeriesColor(
										this._selected.group,
										this._selected.series);
								var o = a.jqx._adjustColor(c, 0.7);
								this.renderer.setAttrs(this._pointMarker, {
									fill : c,
									stroke : o,
									opacity : 1
								});
								this.renderer.setAttrs(this._pointMarker, {
									cx : l,
									cy : j
								});
								this._startTooltipTimer(n,
										this._selected.series, e)
							}
						},
						_startTooltipTimer : function(h, f, d) {
							this._cancelTooltipTimer();
							var b = this;
							var e = b.seriesGroups[h];
							var c = this.toolTipShowDelay || this.toolTipDelay;
							if (isNaN(c) || c > 10000 || c < 0) {
								c = 500
							}
							this._tttimer = setTimeout(function() {
								b._showToolTip(b._mouseX, b._mouseY - 3, h, f,
										d);
								var g = this.toolTipHideDelay;
								if (isNaN(g)) {
									g = 4000
								}
								b._tttimer = setTimeout(function() {
									b._hideToolTip()
								}, g)
							}, c)
						},
						_cancelTooltipTimer : function() {
							clearTimeout(this._tttimer)
						},
						_getGroupGradientType : function(c) {
							var b = this.seriesGroups[c];
							if (b.type.indexOf("area") != -1) {
								return "verticalLinearGradient"
							} else {
								if (b.type.indexOf("column") != -1) {
									return "horizontalLinearGradient"
								} else {
									if (b.type.indexOf("scatter") != -1
											|| b.type.indexOf("bubble") != -1) {
										return "radialGradient"
									}
								}
							}
							return undefined
						},
						_select : function(d, h, f, c) {
							if (this._selected && this._selected.element != d) {
								this._unselect()
							}
							this._selected = {
								element : d,
								group : h,
								series : f,
								item : c
							};
							var e = this.seriesGroups[h];
							var b = this._getColors(h, f, c, this
									._getGroupGradientType(h));
							if (e.type.indexOf("line") != -1
									&& e.type.indexOf("area") == -1) {
								b.fillSelected = "none"
							}
							this.renderer.setAttrs(d, {
								stroke : b.lineSelected,
								fill : b.fillSelected
							})
						},
						_unselect : function() {
							if (this._selected) {
								var h = this._selected.group;
								var f = this._selected.series;
								var c = this._selected.item;
								var e = this.seriesGroups[h];
								var d = e.series[f];
								var b = this._getColors(h, f, c, this
										._getGroupGradientType(h));
								if (e.type.indexOf("line") != -1
										&& e.type.indexOf("area") == -1) {
									b.fillColor = "none"
								}
								this.renderer.setAttrs(this._selected.element,
										{
											stroke : b.lineColor,
											fill : b.fillColor
										});
								if (e.type.indexOf("line") != -1
										|| e.type.indexOf("area") != -1
										&& !isNaN(c)) {
									this._raiseEvent("mouseout", e, d, c)
								}
								this._selected = undefined
							}
							if (this._pointMarker) {
								this.renderer.removeElement(this._pointMarker);
								this._pointMarker = undefined
							}
						},
						_raiseEvent : function(e, f, d, b) {
							var c = d[e] || f[e];
							var g = 0;
							for (; g < this.seriesGroups.length; g++) {
								if (this.seriesGroups[g] == f) {
									break
								}
							}
							if (g == this.seriesGroups.length) {
								return
							}
							if (c && a.isFunction(c)) {
								c({
									event : e,
									seriesGroup : f,
									serie : d,
									elementIndex : b,
									elementValue : this._getDataValue(b,
											d.dataField, g)
								})
							}
						},
						_calcGroupOffsets : function(f, b) {
							var n = this.seriesGroups[f];
							if (!n.series || n.series.length == 0) {
								return
							}
							if (!this._renderData) {
								this._renderData = new Array()
							}
							while (this._renderData.length < f + 1) {
								this._renderData.push(null)
							}
							if (this._renderData[f] != null) {
								return this._renderData[f]
							}
							var z = new Array();
							var o = n.type.indexOf("stacked") != -1;
							var d = o && n.type.indexOf("100") != -1;
							var l = this._getDataLen(f);
							var B = n.baselineValue || 0;
							var C = this._stats.seriesGroups[f];
							if (!C || !C.isValid) {
								return
							}
							if (B > C.max) {
								B = C.max
							}
							if (B < C.min) {
								B = C.min
							}
							var u = d ? C.maxRange : C.max - C.min;
							var D = b.height / u;
							var e = 0;
							if (d) {
								if (C.min * C.max < 0) {
									u /= 2;
									e = b.y + b.height - (u + B) * D
								} else {
									e = b.y + b.height - B * D
								}
							} else {
								e = b.y + b.height - (B - C.min) * D
							}
							var s = new Array();
							var c = new Array();
							e = a.jqx._ptrnd(e);
							var g = (C.min * C.max < 0) ? b.height / 2
									: b.height;
							for ( var w = 0; w < n.series.length; w++) {
								z.push(new Array());
								for ( var x = 0; x < l; x++) {
									var E = this._getDataValueAsNumber(x,
											n.series[w].dataField, f);
									if (isNaN(E)) {
										continue
									}
									if (E > C.rmax) {
										E = C.rmax
									}
									if (E < C.rmin) {
										E = C.rmin
									}
									var m = (E > B) ? s : c;
									var A = D * (E - B);
									var r = e;
									if (o) {
										if (d) {
											var p = (C.psums[x] - C.nsums[x]);
											if (E > B) {
												A = (C.psums[x] / p) * g;
												if (C.psums[x] != 0) {
													A *= E / C.psums[x]
												}
											} else {
												A = (C.nsums[x] / p) * g;
												if (C.nsums[x] != 0) {
													A *= E / C.nsums[x]
												}
											}
										}
										if (isNaN(m[x])) {
											m[x] = e
										}
										r = m[x]
									}
									A = Math.abs(A);
									A = this._isVML ? Math.round(A) : a.jqx
											._rup(A);
									if (w == n.series.length - 1 && d) {
										var q = 0;
										for ( var v = 0; v < w; v++) {
											q += Math.abs(z[v][x].to
													- z[v][x].from)
										}
										q += A;
										if (q < g) {
											if (A > 0.5) {
												A = a.jqx._ptrnd(A + g - q)
											} else {
												var v = w - 1;
												while (v >= 0) {
													var t = Math.abs(z[v][x].to
															- z[v][x].from);
													if (t > 1) {
														if (z[v][x].from > z[v][x].to) {
															z[v][x].from += g
																	- q
														}
														break
													}
													v--
												}
											}
										}
									}
									if (E < B) {
										m[x] += A;
										z[w].push({
											from : r + 1,
											to : r + A
										})
									} else {
										m[x] -= A;
										z[w].push({
											from : r,
											to : r - A
										})
									}
								}
							}
							var A = D * Math.max(C.min, B);
							this._renderData[f] = {
								baseOffset : e,
								offsets : z
							};
							this._renderData[f].xoffsets = this
									._calculateXOffsets(f, b);
							return this._renderData[f]
						},
						_isPointSeriesOnly : function() {
							for ( var b = 0; b < this.seriesGroups.length; b++) {
								var c = this.seriesGroups[b];
								if (c.type.indexOf("line") == -1
										&& c.type.indexOf("area") == -1
										&& c.type.indexOf("scatter") == -1
										&& c.type.indexOf("bubble") == -1) {
									return false
								}
							}
							return true
						},
						_alignValuesWithTicks : function(f) {
							var b = this._isPointSeriesOnly();
							var e = this._getCategoryAxis(f);
							var d = e.valuesOnTicks == undefined ? b
									: e.valuesOnTicks != false;
							if (f == undefined) {
								return d
							}
							var c = this.seriesGroups[f];
							if (c.valuesOnTicks == undefined) {
								return d
							}
							return c.valuesOnTicks
						},
						_getYearsDiff : function(c, b) {
							return b.getFullYear() - c.getFullYear()
						},
						_getMonthsDiff : function(c, b) {
							return 12 * (b.getFullYear() - c.getFullYear())
									+ b.getMonth() - c.getMonth()
						},
						_getDaysDiff : function(c, b) {
							return (b.valueOf() - c.valueOf())
									/ (1000 * 24 * 3600)
						},
						_getDateDiff : function(e, d, c) {
							var b = 0;
							if (c == "year") {
								b = this._getYearsDiff(e, d)
							} else {
								if (c == "month") {
									b = this._getMonthsDiff(e, d)
								} else {
									b = this._getDaysDiff(e, d)
								}
							}
							return b
						},
						_getDatesArray : function(d, k, m, l) {
							var f = [];
							var g = this._getDateDiff(d, k, m) + 1;
							if (m == "year") {
								if (l) {
									g++
								}
								var b = d.getFullYear();
								for ( var e = 0; e < g; e++) {
									f.push(new Date(b, 0, 1, 0, 0, 0, 0));
									b++
								}
							} else {
								if (m == "month") {
									if (l) {
										g++
									}
									var h = d.getMonth();
									var j = d.getFullYear();
									for ( var e = 0; e < g; e++) {
										f.push(new Date(j, h, 1, 0, 0, 0, 0));
										h++;
										if (h > 11) {
											j++;
											h = 0
										}
									}
								} else {
									if (m == "day") {
										for ( var e = 0; e < g; e++) {
											var c = new Date(d.valueOf() + e
													* 1000 * 3600 * 24);
											f.push(c)
										}
									}
								}
							}
							return f
						},
						_calculateXOffsets : function(c, b) {
							var j = this._getCategoryAxis(c);
							var u = new Array();
							var h = this._getDataLen(c);
							var C = j.type == "date";
							var m = C ? this._castAsDate(j.minValue) : this
									._castAsNumber(j.minValue);
							var o = C ? this._castAsDate(j.maxValue) : this
									._castAsNumber(j.maxValue);
							var s = m, v = o;
							if (isNaN(s) || isNaN(v)) {
								for ( var w = 0; w < h; w++) {
									var q = this._getDataValue(w, j.dataField,
											c);
									q = C ? this._castAsDate(q) : this
											._castAsNumber(q);
									if (q == undefined || isNaN(q)) {
										continue
									}
									if (q < s || isNaN(s)) {
										s = q
									}
									if (q > v || isNaN(v)) {
										v = q
									}
								}
							}
							s = m || s;
							v = o || v;
							if (C && !(this._isDate(s) && this._isDate(v))) {
								throw "Invalid Date values"
							}
							var r = (j.maxValue != undefined)
									|| (j.minValue != undefined);
							if (r && (isNaN(v) || isNaN(s))) {
								r = false;
								throw "Invalid min/max category values"
							}
							if (!r && !C) {
								s = 0;
								v = h - 1
							}
							var z = j.unitInterval;
							if (isNaN(z) || z <= 0) {
								z = 1
							}
							var D = NaN;
							var g = this._alignValuesWithTicks(c);
							if (r) {
								if (g) {
									D = v - s
								} else {
									D = v - s + z
								}
							} else {
								D = h - 1;
								if (!g) {
									D++
								}
							}
							if (D == 0) {
								D = z
							}
							var t = 0;
							var B = v;
							var y = s;
							if (C) {
								D = this._getDateDiff(y, B, j.baseUnit);
								D = a.jqx._rnd(D, 1, false);
								if (!g
										|| (g && (j.baseUnit == "month" || j.baseUnit == "year"))) {
									D++
								}
								if (j.baseUnit != "day") {
									if (j.baseUnit == "month") {
										y = new Date(y.getFullYear(), y
												.getMonth(), 1);
										B = new Date(y);
										B.setMonth(B.getMonth() + D)
									} else {
										y = new Date(y.getFullYear(), 0, 1);
										B = new Date(y);
										B.setYear(B.getYear() + D)
									}
								}
								t = a.jqx._rnd(this._getDateDiff(y, B, "day"),
										1, false);
								if (!g) {
									t++
								}
							}
							var f = Math.max(1, D / z);
							var d = this._plotRect.width / f;
							var p = c != undefined
									&& this.seriesGroups[c].type
											.indexOf("column") != -1;
							var l = 0;
							if (!g && (!C || j.baseUnit == "day") && !p) {
								l = d / 2
							}
							var e = -1, k = -1;
							for ( var w = 0; w < h; w++) {
								if (!r && !C) {
									u.push(a.jqx._ptrnd(l + (w - y) / D
											* b.width));
									if (e == -1) {
										e = w
									}
									if (k == -1 || k < w) {
										k = w
									}
									continue
								}
								var q = this._getDataValue(w, j.dataField, c);
								q = C ? this._castAsDate(q) : this
										._castAsNumber(q);
								if (isNaN(q) || q < y || q > B) {
									u.push(-1);
									continue
								}
								var A = C ? this._getDateDiff(y, q, "day") : q
										- y;
								var n = a.jqx._ptrnd(l + A / (C ? t : D)
										* this._plotRect.width);
								u.push(n);
								if (e == -1) {
									e = w
								}
								if (k == -1 || k < w) {
									k = w
								}
							}
							return {
								data : u,
								first : e,
								last : k,
								length : k == -1 ? 0 : k - e + 1,
								itemWidth : d,
								rangeLength : D,
								min : s,
								max : v,
								customRange : r
							}
						},
						_getCategoryAxis : function(b) {
							if (b == undefined || this.seriesGroups.length <= b) {
								return this.categoryAxis
							}
							return this.seriesGroups[b].categoryAxis
									|| this.categoryAxis
						},
						_getSeriesColor : function(l, c) {
							var e = this.seriesGroups[l];
							var m = e.series[c];
							if (m.color) {
								return m.color
							}
							var k = 0;
							for ( var d = 0; d <= l; d++) {
								for ( var b in this.seriesGroups[d].series) {
									if (d == l && b == c) {
										break
									} else {
										k++
									}
								}
							}
							var h = this.colorScheme;
							if (e.colorScheme) {
								h = e.colorScheme;
								sidex = c
							}
							if (h == undefined || h == "") {
								h = this.colorSchemes[0].name
							}
							if (h) {
								for ( var d = 0; d < this.colorSchemes.length; d++) {
									var f = this.colorSchemes[d];
									if (f.name == h) {
										while (k > f.colors.length) {
											k -= f.colors.length;
											if (++d >= this.colorSchemes.length) {
												d = 0
											}
											f = this.colorSchemes[d]
										}
										return f.colors[k % f.colors.length]
									}
								}
							}
							return "#222222"
						},
						_getColor : function(c, e) {
							if (c == undefined || c == "") {
								c = this.colorSchemes[0].name
							}
							for ( var f = 0; f < this.colorSchemes.length; f++) {
								if (c == this.colorSchemes[f].name) {
									break
								}
							}
							var d = 0;
							while (d <= e) {
								if (f == this.colorSchemes.length) {
									f = 0
								}
								var b = this.colorSchemes[f].colors.length;
								if (d + b <= e) {
									d += b;
									f++
								} else {
									return this.colorSchemes[f].colors[e - d]
								}
							}
						},
						colorSchemes : [
								{
									name : "scheme01",
									colors : [ "#4572A7", "#AA4643", "#89A54E",
											"#71588F", "#4198AF" ]
								},
								{
									name : "scheme02",
									colors : [ "#7FD13B", "#EA157A", "#FEB80A",
											"#00ADDC", "#738AC8" ]
								},
								{
									name : "scheme03",
									colors : [ "#E8601A", "#FF9639", "#F5BD6A",
											"#599994", "#115D6E" ]
								},
								{
									name : "scheme04",
									colors : [ "#D02841", "#FF7C41", "#FFC051",
											"#5B5F4D", "#364651" ]
								},
								{
									name : "scheme05",
									colors : [ "#25A0DA", "#309B46", "#8EBC00",
											"#FF7515", "#FFAE00" ]
								},
								{
									name : "scheme06",
									colors : [ "#0A3A4A", "#196674", "#33A6B2",
											"#9AC836", "#D0E64B" ]
								},
								{
									name : "scheme07",
									colors : [ "#CC6B32", "#FFAB48", "#FFE7AD",
											"#A7C9AE", "#888A63" ]
								},
								{
									name : "scheme08",
									colors : [ "#2F2933", "#01A2A6", "#29D9C2",
											"#BDF271", "#FFFFA6" ]
								},
								{
									name : "scheme09",
									colors : [ "#1B2B32", "#37646F", "#A3ABAF",
											"#E1E7E8", "#B22E2F" ]
								},
								{
									name : "scheme10",
									colors : [ "#5A4B53", "#9C3C58", "#DE2B5B",
											"#D86A41", "#D2A825" ]
								},
								{
									name : "scheme11",
									colors : [ "#993144", "#FFA257", "#CCA56A",
											"#ADA072", "#949681" ]
								} ],
						_formatValue : function(c, f, b) {
							if (c == undefined) {
								return ""
							}
							if (this._isObject(c) && !b) {
								return ""
							}
							if (b) {
								if (!a.isFunction(b)) {
									return c.toString()
								}
								try {
									return b(c)
								} catch (d) {
									return d.message
								}
							}
							if (this._isNumber(c)) {
								return this._formatNumber(c, f)
							}
							if (this._isDate(c)) {
								return this._formatDate(c, f)
							}
							return c.toString()
						},
						_getFormattedValue : function(k, e, b, c, d) {
							var h = this.seriesGroups[k];
							var m = h.series[e];
							var l = "";
							var f = c, i = d;
							if (!i) {
								i = m.formatFunction || h.formatFunction
							}
							if (!f) {
								f = m.formatSettings || h.formatSettings
							}
							if (!m.formatFunction && m.formatSettings) {
								i = undefined
							}
							var j = this._getDataValue(b, m.dataField, k);
							if (j) {
								l = this._formatValue(j, f, i)
							}
							return l || ""
						},
						_isNumberAsString : function(d) {
							if (typeof (d) != "string") {
								return false
							}
							for ( var b = 0; b < d.length; b++) {
								var c = d.charAt(b);
								if ((c >= "0" && c <= "9") || c == ","
										|| c == ".") {
									continue
								}
								if (c == "-" && b == 0) {
									continue
								}
								if ((c == "(" && b == 0)
										|| (c == ")" && b == d.length - 1)) {
									continue
								}
								return false
							}
							return true
						},
						_castAsDate : function(c) {
							if (c instanceof Date && !isNaN(c)) {
								return c
							}
							if (typeof (c) == "string") {
								var b = new Date(c);
								if (b != undefined) {
									return b
								}
							}
							return undefined
						},
						_castAsNumber : function(c) {
							if (c instanceof Date && !isNaN(c)) {
								return c.valueOf()
							}
							if (typeof (c) == "string") {
								if (this._isNumber(c)) {
									c = parseFloat(c)
								} else {
									var b = new Date(c);
									if (b != undefined) {
										c = b.valueOf()
									}
								}
							}
							return c
						},
						_isNumber : function(b) {
							if (typeof (b) == "string") {
								if (this._isNumberAsString(b)) {
									b = parseFloat(b)
								}
							}
							return typeof b === "number" && isFinite(b)
						},
						_isDate : function(b) {
							return b instanceof Date
						},
						_isBoolean : function(b) {
							return typeof b === "boolean"
						},
						_isObject : function(b) {
							return (b && (typeof b === "object" || a
									.isFunction(b))) || false
						},
						_formatDate : function(c, b) {
							return c.toString()
						},
						_formatNumber : function(n, e) {
							if (!this._isNumber(n)) {
								return n
							}
							e = e || {};
							var q = e.decimalSeparator || ".";
							var o = e.thousandsSeparator || "";
							var m = e.prefix || "";
							var p = e.sufix || "";
							var h = e.decimalPlaces
									|| ((n * 100 != parseInt(n) * 100) ? 2 : 0);
							var l = e.negativeWithBrackets || false;
							var g = (n < 0);
							if (g && l) {
								n *= -1
							}
							var d = n.toString();
							var b;
							var k = Math.pow(10, h);
							d = (Math.round(n * k) / k).toString();
							if (isNaN(d)) {
								d = ""
							}
							b = d.lastIndexOf(".");
							if (h > 0) {
								if (b < 0) {
									d += q;
									b = d.length - 1
								} else {
									if (q !== ".") {
										d = d.replace(".", q)
									}
								}
								while ((d.length - 1 - b) < h) {
									d += "0"
								}
							}
							b = d.lastIndexOf(q);
							b = (b > -1) ? b : d.length;
							var f = d.substring(b);
							var c = 0;
							for ( var j = b; j > 0; j--, c++) {
								if ((c % 3 === 0) && (j !== b)
										&& (!g || (j > 1) || (g && l))) {
									f = o + f
								}
								f = d.charAt(j - 1) + f
							}
							d = f;
							if (g && l) {
								d = "(" + d + ")"
							}
							return m + d + p
						},
						_defaultNumberFormat : {
							prefix : "",
							sufix : "",
							decimalSeparator : ".",
							thousandsSeparator : ",",
							decimalPlaces : 2,
							negativeWithBrackets : false
						},
						_getBezierPoints : function(e) {
							var h = [];
							var f = e.split(" ");
							for ( var d = 0; d < f.length; d++) {
								var j = f[d].split(",");
								h.push({
									x : parseFloat(j[0]),
									y : parseFloat(j[1])
								})
							}
							var k = "";
							for ( var d = 0; d < h.length - 1; d++) {
								var b = [];
								if (0 == d) {
									b.push(h[d]);
									b.push(h[d]);
									b.push(h[d + 1]);
									b.push(h[d + 2])
								} else {
									if (h.length - 2 == d) {
										b.push(h[d - 1]);
										b.push(h[d]);
										b.push(h[d + 1]);
										b.push(h[d + 1])
									} else {
										b.push(h[d - 1]);
										b.push(h[d]);
										b.push(h[d + 1]);
										b.push(h[d + 2])
									}
								}
								var c = [];
								var g = 9;
								c.push({
									x : b[1].x,
									y : b[1].y
								});
								c.push({
									x : ((-b[0].x + g * b[1].x + b[2].x) / g),
									y : ((-b[0].y + g * b[1].y + b[2].y) / g)
								});
								c.push({
									x : ((b[1].x + g * b[2].x - b[3].x) / g),
									y : ((b[1].y + g * b[2].y - b[3].y) / g)
								});
								c.push({
									x : b[2].x,
									y : b[2].y
								});
								k += "C" + a.jqx._ptrnd(c[1].x) + ","
										+ a.jqx._ptrnd(c[1].y) + " "
										+ a.jqx._ptrnd(c[2].x) + ","
										+ a.jqx._ptrnd(c[2].y) + " "
										+ a.jqx._ptrnd(c[3].x) + ","
										+ a.jqx._ptrnd(c[3].y) + " "
							}
							return k
						},
						_animTickInt : 50,
						_animate : function(d, c, f, e, b, h) {
							if (!this._animList) {
								this._animList = [];
								this._animTicks = 0
							}
							var g = this._animTicks
									+ Math.round(f / this._animTickInt);
							if (h == undefined) {
								h = "easeInOutSine"
							}
							this._animList.push({
								key : d,
								properties : c,
								startTick : this._animTicks,
								endTick : g,
								fn : e,
								context : b,
								easing : h
							});
							this._enableAnimTimer()
						},
						_enableAnimTimer : function() {
							if (!this._animtimer) {
								var b = this;
								this._animtimer = setTimeout(function() {
									b._runAnimation()
								}, this._animTickInt)
							}
						},
						_runAnimation : function() {
							if (this._animList) {
								this._animTicks++;
								var m = [];
								for ( var k = 0; k < this._animList.length; k++) {
									var n = this._animList[k];
									if (n.endTick > this._animTicks) {
										m.push(n)
									}
									var b = (this._animTicks - n.startTick)
											* this._animTickInt;
									var e = (n.endTick - n.startTick)
											* this._animTickInt;
									var l = b / e;
									var d = l;
									if (n.easing) {
										d = jQuery.easing[n.easing](l, b, 0, 1,
												e)
									}
									if (l > 1) {
										l = 1
									}
									if (n.fn) {
										n.fn(n.key, n.context, d);
										continue
									}
									var g = {};
									for ( var h = 0; h < n.properties.length; h++) {
										var c = n.properties[h];
										var f = 0;
										if (l == 1) {
											f = c.to
										} else {
											f = d * (c.to - c.from) + c.from
										}
										g[c.key] = f
									}
									this.renderer.setAttrs(n.key, g)
								}
								this._animList = m
							}
							this._animtimer = null;
							this._enableAnimTimer()
						}
					});
	a.jqx._adjustColor = function(d, b) {
		var e = a.jqx.cssToRgb(d);
		var d = "#";
		for ( var f = 0; f < 3; f++) {
			var g = Math.round(b * e[f]);
			if (g > 255) {
				g = 255
			} else {
				if (g <= 0) {
					g = 0
				}
			}
			g = a.jqx.decToHex(g);
			if (g.toString().length == 1) {
				d += "0"
			}
			d += g
		}
		return d.toUpperCase()
	};
	a.jqx.decToHex = function(b) {
		return b.toString(16)
	}, a.jqx.hexToDec = function(b) {
		return parseInt(b, 16)
	};
	a.jqx.rgbToHex = function(e, d, c) {
		return [ a.jqx.decToHex(e), a.jqx.decToHex(d), a.jqx.decToHex(c) ]
	};
	a.jqx.hexToRgb = function(c, d, b) {
		return [ a.jqx.hexToDec(c), a.jqx.hexToDec(d), a.jqx.hexToDec(b) ]
	};
	a.jqx.cssToRgb = function(b) {
		if (b.indexOf("rgb") <= -1) {
			return a.jqx.hexToRgb(b.substring(1, 3), b.substring(3, 5), b
					.substring(5, 7))
		}
		return b.substring(4, b.length - 1).split(",")
	};
	a.jqx._ptrnd = function(c) {
		if (!document.createElementNS) {
			if (Math.round(c) == c) {
				return c
			}
			return a.jqx._rnd(c, 1, false)
		}
		if (Math.abs(Math.round(c) - c) == 0.5) {
			return c
		}
		var b = a.jqx._rnd(c, 1, false);
		return b - 0.5
	};
	a.jqx._rup = function(c) {
		var b = Math.round(c);
		if (c > b) {
			b++
		}
		return b
	};
	a.jqx._rnd = function(c, e, d) {
		if (isNaN(c)) {
			return c
		}
		var b = c - c % e;
		if (c == b) {
			return b
		}
		if (d) {
			if (c > b) {
				b += e
			}
		} else {
			if (b > c) {
				b -= e
			}
		}
		return b
	};
	a.jqx.svgRenderer = function() {
	};
	a.jqx.svgRenderer.prototype = {
		_svgns : "http://www.w3.org/2000/svg",
		init : function(f) {
			var d = "<table id=tblChart cellspacing='0' cellpadding='0' border='0' align='left' valign='top'><tr><td colspan=2 id=tdTop></td></tr><tr><td id=tdLeft></td><td class='chartContainer'></td></tr></table>";
			f.append(d);
			this.host = f;
			var b = f.find(".chartContainer");
			b[0].style.width = f.width() + "px";
			b[0].style.height = f.height() + "px";
			var h;
			try {
				var c = document.createElementNS(this._svgns, "svg");
				c.setAttribute("id", "svgChart");
				c.setAttribute("version", "1.1");
				c.setAttribute("width", "100%");
				c.setAttribute("height", "100%");
				b[0].appendChild(c);
				this.canvas = c
			} catch (g) {
				return false
			}
			this._id = new Date().getTime();
			this.clear();
			this._layout();
			this._runLayoutFix();
			return true
		},
		_runLayoutFix : function() {
			var b = this;
			this._fixLayout()
		},
		_fixLayout : function() {
			var g = a(this.canvas).position();
			var d = (parseFloat(g.left) == parseInt(g.left));
			var b = (parseFloat(g.top) == parseInt(g.top));
			if (a.browser.msie) {
				var d = true, b = true;
				var e = this.host;
				var c = 0, f = 0;
				while (e && e.position && e[0].parentNode) {
					var h = e.position();
					c += parseFloat(h.left) - parseInt(h.left);
					f += parseFloat(h.top) - parseInt(h.top);
					e = e.parent()
				}
				d = parseFloat(c) == parseInt(c);
				b = parseFloat(f) == parseInt(f)
			}
			if (!d) {
				this.host.find("#tdLeft")[0].style.width = "0.5px"
			}
			if (!b) {
				this.host.find("#tdTop")[0].style.height = "0.5px"
			}
		},
		_layout : function() {
			var c = a(this.canvas).offset();
			var b = this.host.find(".chartContainer");
			this._width = Math.max(a.jqx._rup(this.host.width()) - 1, 0);
			this._height = Math.max(a.jqx._rup(this.host.height()) - 1, 0);
			b[0].style.width = this._width;
			b[0].style.height = this._height;
			this._fixLayout()
		},
		getRect : function() {
			return {
				x : 0,
				y : 0,
				width : this._width,
				height : this._height
			}
		},
		getContainer : function() {
			var b = this.host.find(".chartContainer");
			return b
		},
		clear : function() {
			while (this.canvas.childElementCount > 0) {
				this.canvas.removeChild(this.canvas.firstElementChild)
			}
			this._defs = document.createElementNS(this._svgns, "defs");
			this._gradients = {};
			this.canvas.appendChild(this._defs)
		},
		removeElement : function(c) {
			if (c != undefined) {
				try {
					if (c.parentNode) {
						c.parentNode.removeChild(c)
					} else {
						this.canvas.removeChild(c)
					}
				} catch (b) {
				}
			}
		},
		_openGroups : [],
		beginGroup : function() {
			var b = this._activeParent();
			var c = document.createElementNS(this._svgns, "g");
			b.appendChild(c);
			this._openGroups.push(c);
			return c
		},
		endGroup : function() {
			if (this._openGroups.length == 0) {
				return
			}
			this._openGroups.pop()
		},
		_activeParent : function() {
			return this._openGroups.length == 0 ? this.canvas
					: this._openGroups[this._openGroups.length - 1]
		},
		createClipRect : function(d) {
			var e = document.createElementNS(this._svgns, "clipPath");
			var b = document.createElementNS(this._svgns, "rect");
			this.setAttrs(b, {
				x : d.x,
				y : d.y,
				width : d.width,
				height : d.height
			});
			this._clipId = this._clipId || 0;
			e.id = "cl" + this._id + "_" + (++this._clipId).toString();
			e.appendChild(b);
			this._defs.appendChild(e);
			return e
		},
		setClip : function(c, b) {
			return this.setAttr(c, "clip-path", "url(#" + b.id + ")")
		},
		_clipId : 0,
		addHandler : function(b, d, c) {
			b["on" + d] = c
		},
		shape : function(b, e) {
			var c = document.createElementNS(this._svgns, b);
			if (!c) {
				return undefined
			}
			for ( var d in e) {
				c.setAttribute(d, e[d])
			}
			this._activeParent().appendChild(c);
			return c
		},
		measureText : function(k, c, d) {
			var f = document.createElementNS(this._svgns, "text");
			this.setAttrs(f, d);
			f.appendChild(f.ownerDocument.createTextNode(k));
			var j = this._activeParent();
			j.appendChild(f);
			var l = f.getBBox();
			var g = a.jqx._rup(l.width);
			var b = a.jqx._rup(l.height);
			j.removeChild(f);
			if (c == 0) {
				return {
					width : g,
					height : b
				}
			}
			var h = c * Math.PI * 2 / 360;
			var e = Math.abs(g * Math.sin(h) - b * Math.cos(h));
			var i = Math.abs(g * Math.cos(h) + b * Math.sin(h));
			return {
				width : a.jqx._rup(i),
				height : a.jqx._rup(e)
			}
		},
		text : function(o, l, k, s, q, z, B, A, n, g) {
			var r;
			if (!n) {
				n = "center"
			}
			if (!g) {
				g = "center"
			}
			if (A) {
				r = this.beginGroup();
				var e = this.createClipRect({
					x : a.jqx._rup(l),
					y : a.jqx._rup(k),
					width : a.jqx._rup(s),
					height : a.jqx._rup(q)
				});
				this.setClip(r, e)
			}
			var p = document.createElementNS(this._svgns, "text");
			this.setAttrs(p, B);
			p.appendChild(p.ownerDocument.createTextNode(o));
			var j = this._activeParent();
			j.appendChild(p);
			var b = p.getBBox();
			j.removeChild(p);
			var C = b.width;
			var i = b.height * 0.6;
			var m = s || 0;
			var u = q || 0;
			if (!z || z == 0) {
				if (n == "center") {
					l += (m - C) / 2
				} else {
					if (n == "right") {
						l += (m - C)
					}
				}
				k += i;
				if (g == "center") {
					k += (u - i) / 2
				} else {
					if (g == "bottom") {
						k += u - i
					}
				}
				if (!s) {
					s = C
				}
				if (!q) {
					q = i
				}
				this.setAttrs(p, {
					x : a.jqx._rup(l),
					y : a.jqx._rup(k),
					width : a.jqx._rup(s),
					height : a.jqx._rup(q),
					cursor : "default"
				});
				j.appendChild(p);
				this.endGroup();
				return p
			}
			var f = z * Math.PI * 2 / 360;
			var d = Math.abs(C * Math.sin(f) - i * Math.cos(f));
			var v = Math.abs(C * Math.cos(f) + i * Math.sin(f));
			if (n == "center") {
				l += (m - v) / 2
			} else {
				if (n == "right") {
					l += (m - v)
				}
			}
			if (g == "center") {
				k = k + (u - d) / 2
			} else {
				if (g == "bottom") {
					k = k + u - d
				}
			}
			if (z < 0) {
				k += d
			}
			l += v;
			l = a.jqx._rup(l);
			k = a.jqx._rup(k);
			var t = this.shape("g", {
				transform : "translate(" + l + "," + k + ")"
			});
			var c = this.shape("g", {
				transform : "rotate(" + z + ")"
			});
			t.appendChild(c);
			c.appendChild(p);
			j.appendChild(t);
			this.endGroup();
			return t
		},
		line : function(d, f, c, e, g) {
			var b = this.shape("line", {
				x1 : d,
				y1 : f,
				x2 : c,
				y2 : e
			});
			this.setAttrs(b, g)
		},
		path : function(c, d) {
			var b = this.shape("path");
			b.setAttribute("d", c);
			if (d) {
				this.setAttrs(b, d)
			}
			return b
		},
		rect : function(b, g, c, e, f) {
			b = a.jqx._ptrnd(b);
			g = a.jqx._ptrnd(g);
			c = a.jqx._rup(c);
			e = a.jqx._rup(e);
			var d = this.shape("rect", {
				x : b,
				y : g,
				width : c,
				height : e
			});
			if (f) {
				this.setAttrs(d, f)
			}
			return d
		},
		circle : function(b, d, c) {
			return this.shape("circle", {
				cx : b,
				cy : d,
				r : c
			})
		},
		_getPieSlicePath : function(p, m, b, j, f, n) {
			if (!b) {
				b = 1
			}
			var q = Math.abs(j - f);
			var k = q > 180 ? 1 : 0;
			if (q > 360) {
				j = 0;
				f = 360
			}
			if (q >= 360) {
				f = j + 359.9
			}
			var d = j * Math.PI * 2 / 360;
			var i = f * Math.PI * 2 / 360;
			if (n != 0) {
				var g = q / 2 + j;
				var h = g * Math.PI * 2 / 360;
				offsetX = n * Math.cos(h);
				offsetY = n * Math.sin(h);
				p += offsetX;
				m -= offsetY
			}
			var e = p + b * Math.cos(d);
			var c = p + b * Math.cos(i);
			var o = m - b * Math.sin(d);
			var l = m - b * Math.sin(i);
			var s = "M " + c + "," + l;
			s += "  " + c + "," + l + " a" + b + "," + b;
			s += " 0 " + k + ",1 " + (e - c) + "," + (o - l);
			s += " L" + p + "," + m + " Z";
			return s
		},
		pieslice : function(i, g, b, e, c, h, d) {
			var f = this._getPieSlicePath(i, g, b, e, c, h);
			var j = this.shape("path");
			j.setAttribute("d", f);
			if (d) {
				this.setAttrs(j, d)
			}
			return j
		},
		setAttrs : function(b, d) {
			if (!b || !d) {
				return
			}
			for ( var c in d) {
				b.setAttribute(c, d[c])
			}
		},
		setAttr : function(c, b, d) {
			if (!c) {
				return
			}
			c.setAttribute(b, d)
		},
		getAttr : function(c, b) {
			return c.getAttribute(b)
		},
		_gradients : {},
		_toLinearGradient : function(e, g, h) {
			var c = "grd" + e.replace("#", "") + (g ? "v" : "h");
			var b = "url(#" + c + ")";
			if (this._gradients[b]) {
				return b
			}
			var d = document.createElementNS(this._svgns, "linearGradient");
			this.setAttrs(d, {
				x1 : "0%",
				y1 : "0%",
				x2 : g ? "0%" : "100%",
				y2 : g ? "100%" : "0%",
				id : c
			});
			for ( var f in h) {
				var j = document.createElementNS(this._svgns, "stop");
				var i = "stop-color:" + a.jqx._adjustColor(e, h[f][1]);
				this.setAttrs(j, {
					offset : h[f][0] + "%",
					style : i
				});
				d.appendChild(j)
			}
			this._defs.appendChild(d);
			this._gradients[b] = true;
			return b
		}
	};
	a.jqx.vmlRenderer = function() {
	};
	a.jqx.vmlRenderer.prototype = {
		init : function(f) {
			var e = "<div class='chartContainer' style=\"position:relative;overflow:hidden;\"><div>";
			f.append(e);
			this.host = f;
			var b = f.find(".chartContainer");
			b[0].style.width = f.width() + "px";
			b[0].style.height = f.height() + "px";
			var d = true;
			for ( var c = 0; c < document.namespaces.length; c++) {
				if (document.namespaces[c].name == "v"
						&& document.namespaces[c].urn == "urn:schemas-microsoft-com:vml") {
					d = false;
					break
				}
			}
			if (a.browser.msie
					&& parseInt(a.browser.version) < 9
					&& (document.childNodes && document.childNodes.length > 0
							&& document.childNodes[0].data && document.childNodes[0].data
							.indexOf("DOCTYPE") != -1)) {
				if (d) {
					document.namespaces.add("v",
							"urn:schemas-microsoft-com:vml")
				}
				this._ie8mode = true
			} else {
				if (d) {
					document.namespaces.add("v",
							"urn:schemas-microsoft-com:vml");
					document.createStyleSheet().cssText = "v\\:* { behavior: url(#default#VML); display: inline-block; }"
				}
			}
			this.canvas = b[0];
			this._width = Math.max(a.jqx._rup(b.width()), 0);
			this._height = Math.max(a.jqx._rup(b.height()), 0);
			b[0].style.width = this._width + 2;
			b[0].style.height = this._height + 2;
			this._id = new Date().getTime();
			this.clear();
			return true
		},
		getRect : function() {
			return {
				x : 0,
				y : 0,
				width : this._width,
				height : this._height
			}
		},
		getContainer : function() {
			var b = this.host.find(".chartContainer");
			return b
		},
		clear : function() {
			while (this.canvas.childElementCount > 0) {
				this.canvas.removeChild(this.canvas.firstElementChild)
			}
			this._gradients = {}
		},
		removeElement : function(b) {
			if (b != null) {
				b.parentNode.removeChild(b)
			}
		},
		_openGroups : [],
		beginGroup : function() {
			var b = this._activeParent();
			var c = document.createElement("v:group");
			c.style.position = "absolute";
			c.coordorigin = "0,0";
			c.coordsize = this._width + "," + this._height;
			c.style.left = 0;
			c.style.top = 0;
			c.style.width = this._width;
			c.style.height = this._height;
			b.appendChild(c);
			this._openGroups.push(c);
			return c
		},
		endGroup : function() {
			if (this._openGroups.length == 0) {
				return
			}
			this._openGroups.pop()
		},
		_activeParent : function() {
			return this._openGroups.length == 0 ? this.canvas
					: this._openGroups[this._openGroups.length - 1]
		},
		createClipRect : function(b) {
			var c = document.createElement("div");
			c.style.height = b.height + "px";
			c.style.width = b.width + "px";
			c.style.position = "absolute";
			c.style.left = b.x + "px";
			c.style.top = b.y + "px";
			c.style.overflow = "hidden";
			this._clipId = this._clipId || 0;
			c.id = "cl" + this._id + "_" + (++this._clipId).toString();
			this._activeParent().appendChild(c);
			return c
		},
		setClip : function(c, b) {
			b.appendChild(c)
		},
		_clipId : 0,
		addHandler : function(b, d, c) {
			a(b).bind(d, c)
		},
		measureText : function(m, c, d) {
			var e = document.createElement("v:textbox");
			var k = document.createElement("span");
			k.appendChild(document.createTextNode(m));
			e.appendChild(k);
			if (d["class"]) {
				k.className = d["class"]
			}
			var l = this._activeParent();
			l.appendChild(e);
			var g = a(e);
			var h = a.jqx._rup(g.width());
			var b = a.jqx._rup(g.height());
			l.removeChild(e);
			if (b == 0 && a.browser.msie && parseInt(a.browser.version) < 9) {
				var n = g.css("font-size");
				if (n) {
					b = parseInt(n);
					if (isNaN(b)) {
						b = 0
					}
				}
			}
			if (c == 0) {
				return {
					width : h,
					height : b
				}
			}
			var i = c * Math.PI * 2 / 360;
			var f = Math.abs(h * Math.sin(i) - b * Math.cos(i));
			var j = Math.abs(h * Math.cos(i) + b * Math.sin(i));
			return {
				width : a.jqx._rup(j),
				height : a.jqx._rup(f)
			}
		},
		text : function(o, l, k, r, p, A, C, B, n, g) {
			var s = C.stroke || "black";
			var q;
			if (!n) {
				n = "center"
			}
			if (!g) {
				g = "center"
			}
			B = false;
			if (B) {
				q = this.beginGroup();
				var e = this.createClipRect({
					x : a.jqx._rup(l),
					y : a.jqx._rup(k),
					width : a.jqx._rup(r),
					height : a.jqx._rup(p)
				});
				this.setClip(q, e)
			}
			var b = document.createElement("v:textbox");
			b.style.position = "absolute";
			var t = document.createElement("span");
			t.appendChild(document.createTextNode(o));
			if (C["class"]) {
				t.className = C["class"]
			}
			b.appendChild(t);
			var j = this._activeParent();
			j.appendChild(b);
			var D = a(b).width();
			var i = a(b).height();
			j.removeChild(b);
			var m = r || 0;
			var v = p || 0;
			if (!A || A == 0) {
				if (n == "center") {
					l += (m - D) / 2
				} else {
					if (n == "right") {
						l += (m - D)
					}
				}
				if (g == "center") {
					k = k + (v - i) / 2
				} else {
					if (g == "bottom") {
						k = k + v - i
					}
				}
				if (!r) {
					r = D
				}
				if (!p) {
					p = i
				}
				if (!q) {
					b.style.left = a.jqx._rup(l);
					b.style.top = a.jqx._rup(k);
					b.style.width = a.jqx._rup(r);
					b.style.height = a.jqx._rup(p)
				}
				j.appendChild(b);
				if (q) {
					this.endGroup();
					return j
				}
				return b
			}
			var f = A * Math.PI * 2 / 360;
			var d = Math.abs(D * Math.sin(f) - i * Math.cos(f));
			var z = Math.abs(D * Math.cos(f) + i * Math.sin(f));
			if (n == "center") {
				l += (m - z) / 2
			} else {
				if (n == "right") {
					l += (m - z)
				}
			}
			if (g == "center") {
				k = k + (v - d) / 2
			} else {
				if (g == "bottom") {
					k = k + v - d
				}
			}
			l = a.jqx._rup(l);
			k = a.jqx._rup(k);
			var u = a.jqx._rup(l + z);
			var c = a.jqx._rup(k + d);
			if (Math.abs(A) == 90) {
				j.appendChild(b);
				b.style.left = a.jqx._rup(l);
				b.style.top = a.jqx._rup(k);
				b.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)";
				if (q) {
					this.endGroup();
					return j
				}
				return b
			}
			return line
		},
		shape : function(b, e) {
			var c = document.createElement(this._createElementMarkup(b));
			if (!c) {
				return undefined
			}
			for ( var d in e) {
				c.setAttribute(d, e[d])
			}
			this._activeParent().appendChild(c);
			return c
		},
		line : function(e, g, d, f, h) {
			var b = "M " + e + "," + g + " L " + d + "," + f + " X E";
			var c = this.path(b);
			this.setAttrs(c, h);
			return c
		},
		_createElementMarkup : function(b) {
			var c = "<v:" + b + ' style=""></v:' + b + ">";
			if (this._ie8mode) {
				c = c.replace('style=""',
						'style="behavior: url(#default#VML);"')
			}
			return c
		},
		path : function(c, e) {
			var b = document.createElement(this._createElementMarkup("shape"));
			b.style.position = "absolute";
			b.coordsize = this._width + " " + this._height;
			b.coordorigin = "0 0";
			b.style.width = parseInt(this._width);
			b.style.height = parseInt(this._height);
			b.style.left = 0;
			b.style.top = 0;
			var d = document.createElement(this._createElementMarkup("path"));
			d.v = c;
			b.appendChild(d);
			this._activeParent().appendChild(b);
			if (e) {
				this.setAttrs(b, e)
			}
			return b
		},
		rect : function(b, g, c, d, f) {
			b = a.jqx._ptrnd(b);
			g = a.jqx._ptrnd(g);
			c = a.jqx._rup(c);
			d = a.jqx._rup(d);
			var e = this.shape("rect", f);
			e.style.position = "absolute";
			e.style.left = b;
			e.style.top = g;
			e.style.width = c;
			e.style.height = d;
			e.strokeweight = 0;
			return e
		},
		circle : function(b, e, d) {
			var c = this.shape("oval");
			b = a.jqx._ptrnd(b - d);
			e = a.jqx._ptrnd(e - d);
			d = a.jqx._rup(d);
			c.style.position = "absolute";
			c.style.left = b;
			c.style.top = e;
			c.style.width = d * 2;
			c.style.height = d * 2;
			return c
		},
		updateCircle : function(d, b, e, c) {
			if (b == undefined) {
				b = parseFloat(d.style.left) + parseFloat(d.style.width) / 2
			}
			if (e == undefined) {
				e = parseFloat(d.style.top) + parseFloat(d.style.height) / 2
			}
			if (c == undefined) {
				c = parseFloat(d.width) / 2
			}
			b = a.jqx._ptrnd(b - c);
			e = a.jqx._ptrnd(e - c);
			c = a.jqx._rup(c);
			d.style.left = b;
			d.style.top = e;
			d.style.width = c * 2;
			d.style.height = c * 2
		},
		_getPieSlicePath : function(h, g, k, s, u, b) {
			if (!k) {
				k = 1
			}
			var j = Math.abs(s - u);
			var m = j > 180 ? 1 : 0;
			if (j > 360) {
				s = 0;
				u = 360
			}
			var n = s * Math.PI * 2 / 360;
			var f = u * Math.PI * 2 / 360;
			if (b != 0) {
				var i = j / 2 + s;
				var t = i * Math.PI * 2 / 360;
				offsetX = b * Math.cos(t);
				offsetY = b * Math.sin(t);
				h += offsetX;
				g -= offsetY
			}
			var p = a.jqx._ptrnd(h + k * Math.cos(n));
			var o = a.jqx._ptrnd(h + k * Math.cos(f));
			var d = a.jqx._ptrnd(g - k * Math.sin(n));
			var c = a.jqx._ptrnd(g - k * Math.sin(f));
			h = a.jqx._ptrnd(h);
			g = a.jqx._ptrnd(g);
			k = a.jqx._ptrnd(k);
			var e = Math.round(s * 65535);
			var q = Math.round((u - s) * 65536);
			var l = "M" + h + " " + g;
			l += " AE " + h + " " + g + " " + k + " " + k + " " + e + " " + q;
			l += " X E";
			return l
		},
		pieslice : function(j, h, b, f, c, i, e) {
			var g = this._getPieSlicePath(j, h, b, f, c, i);
			var d = this.path(g, e);
			if (e) {
				this.setAttrs(d, e)
			}
			return d
		},
		_keymap : [ {
			svg : "fill",
			vml : "fillcolor"
		}, {
			svg : "stroke",
			vml : "strokecolor"
		}, {
			svg : "stroke-width",
			vml : "strokeweight"
		}, {
			svg : "fill-opacity",
			vml : "fillopacity"
		}, {
			svg : "opacity",
			vml : "opacity"
		}, {
			svg : "cx",
			vml : "style.left"
		}, {
			svg : "cy",
			vml : "style.top"
		}, {
			svg : "height",
			vml : "style.height"
		}, {
			svg : "width",
			vml : "style.width"
		}, {
			svg : "x",
			vml : "style.left"
		}, {
			svg : "y",
			vml : "style.top"
		}, {
			svg : "d",
			vml : "v"
		} ],
		_translateParam : function(b) {
			for ( var c in this._keymap) {
				if (this._keymap[c].svg == b) {
					return this._keymap[c].vml
				}
			}
			return b
		},
		setAttrs : function(c, e) {
			if (!c || !e) {
				return
			}
			for ( var d in e) {
				var b = this._translateParam(d);
				if (b == "fillcolor" && e[d].indexOf("grd") != -1) {
					c.type = e[d]
				} else {
					if (b == "opacity" || b == "fillopacity") {
						if (c.fill) {
							c.fill.opacity = e[d]
						}
					} else {
						if (b.indexOf("style.") == -1) {
							c[b] = e[d]
						} else {
							c.style[b.replace("style.", "")] = e[d]
						}
					}
				}
			}
		},
		setAttr : function(d, c, e) {
			var b = this._translateParam(c);
			d[b] = e
		},
		getAttr : function(d, c) {
			var b = this._translateParam(c);
			if (b == "opacity" || b == "fillopacity") {
				if (d.fill) {
					return d.fill.opacity
				} else {
					return 1
				}
			}
			if (b.indexOf("style.") == -1) {
				return d[b]
			}
			return d.style[b.replace("style.", "")]
		},
		_gradients : {},
		_toLinearGradient : function(g, i, j) {
			if (this._ie8mode) {
				return g
			}
			var d = "grd" + g.replace("#", "") + (i ? "v" : "h");
			var e = "#" + d + "";
			if (this._gradients[e]) {
				return e
			}
			var f = document.createElement(this._createElementMarkup("fill"));
			f.type = "gradient";
			f.method = "linear";
			f.angle = i ? 0 : 90;
			var c = "";
			for ( var h in j) {
				if (h > 0) {
					c += ", "
				}
				c += j[h][0] + "% " + a.jqx._adjustColor(g, j[h][1])
			}
			f.colors = c;
			var b = document.createElement(this
					._createElementMarkup("shapetype"));
			b.appendChild(f);
			b.id = d;
			this.canvas.appendChild(b);
			return e
		}
	}
})(jQuery);