---
title: "LaTeX Symbols"
description: "A list of LaTeX symbols. Wrap your code in $$ to render it."
slug: latex-symbols
authors: [pikaroot]
tags: [latex, cheatsheet]
---

List of LaTeX. Wrap `$$` around your code.

<!-- truncate -->

## 1\. Greek and Hebrew Letters

---

| Symbol | LaTeX | Symbol | LaTeX |
| --- | --- | --- | --- |
| $\alpha$ | `\alpha` | $\Phi$, $\phi$ and $\varphi$ | `\Phi`, `\phi` and `\varphi` |
| $\beta$ | `\beta` | $\Pi$, $\pi$ and $\varpi$ | `\Pi`, `\pi` and `\varpi` |
| $\chi$ | `\chi` | $\Psi$ and $\psi$ | `\Psi` and `\psi` |
| $\Delta$ and $\delta$ | `\Delta` and `\delta` | $\rho$ and $\varrho$ | `\rho` and `\varrho` |
| $\epsilon$ and $\varepsilon$ | `\epsilon` and `\varepsilon` | $\Sigma$, $\sigma$ and $\varsigma$ | `\Sigma`, `\sigma` and `\varsigma` |
| $\Gamma$ and $\gamma$ | `\Gamma` and `\gamma` | $\tau$ | `\tau` |
| $\eta$ | `\eta` | $\Theta$, $\theta$ and $\vartheta$ | `\Theta`, `\theta` and `\vartheta` |
| $\iota$ | `\iota` | $\Upsilon$ and $\upsilon$ | `\Upsilon` and `\upsilon` |
| $\kappa$ and $\varkappa$ | `\kappa` and `\varkappa` | $\Xi$ and $\xi$ | `\Xi` and `\xi` |
| $\Lambda$ and $\lambda$ | `\Lambda` and `\lambda` | $\zeta$ | `\zeta` |
| $\mu$ | `\mu` | $\aleph$ | `\aleph` |
| $\nu$ | `\nu` | $\beth$ | `\beth` |
| $\omicron$ | `\omicron` | $\daleth$ | `\daleth` |
| $\Omega$ and $\omega$ | `\Omega` and `\omega` | $\gimel$ | `\gimel` |

### Example

`$$P(\alpha,\beta)$$`

$$
P(\alpha,\beta)
$$

## 2\. LaTeX Math Constructs

---

| Symbol | LaTeX | Symbol | LaTeX |
| --- | --- | --- | --- |
| $\frac{abc}{xyz}$ | `\frac{abc}{xyz}` | $\widehat{abc}$ | `\widehat{abc}` |
| $f^{\prime}$ | `f’` or `f^{\prime}` | $\widetilde{abc}$ | `\widetilde{abc}` |
| $\sqrt{abc}$ | `\sqrt{abc}` | $\overrightarrow{abc}$ | `\overrightarrow{abc}` |
| $\sqrt[n]{abc}$ | `\sqrt[n]{abc}` | $\overleftarrow{abc}$ | `\overleftarrow{abc}` |
| $\overline{abc}$ | `\overline{abc}` | $\overbrace{abc}$ | `\overbrace{abc}` |
| $\underline{abc}$ | `\underline{abc}` | $\underbrace{abc}$ | `\underbrace{abc}` |

### Example

`$$2\frac{4x+1}{y-2}$$`

$$
2\frac{4x+1}{y-2}
$$

`$$[\underbrace{1,2,3,\cdots,p-1}_{\text{p-1 elements}}]$$`

$$
[\underbrace{1,2,3,\cdots,p-1}_{\text{p-1 elements}}]
$$

## 3\. Delimeters

---

| Symbol | LaTeX | Symbol | LaTeX |
| --- | --- | --- | --- |
| $\vert$ | `\|` or `\vert` | $\uparrow$ | `\uparrow` |
| $\Vert$ | `\\|` or `\Vert` | $\Downarrow$ | `\Downarrow` |
| $\{$ | `\{` | $\downarrow$ | `\downarrow` |
| $\}$ | `\}` | $\lfloor$ | `\lfloor` |
| $\langle$ | `\langle` | $\rfloor$ | `\rfloor` |
| $\rangle$ | `\rangle` | $\lceil$ | `\lceil` |
| $/$ | `/` | $\rceil$ | `\rceil` |
| $\backslash$ | `\backslash` | $\llcorner$ | `llcorner` |
| $[$ | `[` | $\lrcorner$ | `lrcorner` |
| $]$ | `]` | $\ulcorner$ | `\ulcorner` |
| $\Uparrow$ | `\Uparrow` | $\urcorner$ | `\urcorner` |

### Example

`$$|\psi\rangle =\frac{1}{\sqrt{2}}|0\rang +|1\rangle$$`

$$
\vert\psi\rangle =\frac{1}{\sqrt{2}} (\vert0\rangle + \vert1\rangle)
$$

`$$\lfloor\frac{q}{2}\rceil$$`

$$
\lfloor\frac{q}{2}\rceil
$$

## 4\. Variable-sized Symbols

---

| Symbol | LaTeX | Symbol | LaTeX |
| --- | --- | --- | --- |
| $\sum$ | `\sum` | $\bigcup$ | `\bigcup` |
| $\prod$ | `\prod` | $\bigsqcup$ | `bigsqcup` |
| $\coprod$ | `\coprod` | $\bigoplus$ | `\bigoplus` |
| $\int$ | `\int` | $\bigotimes$ | `\bigotimes` |
| $\oint$ | `\oint` | $\bigodot$ | `\bigodot` |
| $\iint$ | `\iint` | $\bigvee$ | `\bigvee` |
| $\biguplus$ | `\biguplus` | $\bigwedge$ | `\bigwedge` |
| $\bigcap$ | `\bigcap` |  |  |

### Example

`$$\sum_{n=1}^{\infty} 2^{-n} = 1$$`

$$
\sum_{n=1}^{\infty} 2^{-n} = 1
$$

`$$\prod_{i=a}^{b} f(i)$$`

$$
\prod_{i=a}^{b} f(i)
$$

## 5\. Standard Function Names

---

| Symbol | LaTeX | Symbol | LaTeX |
| --- | --- | --- | --- |
| $\sin$ | `\sin` | $\arcsin$ | `\arcsin` |
| $\cos$ | `\cos` | $\arccos$ | `\arccos` |
| $\tan$ | `\tan` | $\arctan$ | `\arctan` |
| $\cot$ | `\cot` | $\bmod$ | `\bmod` |
| $\sec$ | `\sec` | $\lim$ | `\lim` |
| $\csc$ | `\csc` | $\liminf$ | `\liminf` |
| $\min$ | `\min` | $\limsup$ | `\limsup` |
| $\max$ | `\max` | $\inf$ | `\inf` |
| $\sup$ | `\sup` | $\arg$ | `\arg` |
| $\sinh$ | `\sinh` | $\deg$ | `\deg` |
| $\cosh$ | `\cosh` | $\det$ | `\det` |
| $\tanh$ | `\tanh` | $\dim$ | `\dim` |
| $\coth$ | `\coth` | $\exp$ | `\exp` |
| $\lg$ | `\lg` | $\gcd$ | `\gcd` |
| $\log$ | `\log` | $\hom$ | `\hom` |
| $\ln$ | `\ln` | $\Pr$ | `\Pr` |
| $\ker$ | `\ker` |  |  |

### Example

`$$e^{i\theta}=\cos{\theta}+i\sin{\theta}$$`

$$
e^{i\theta}=\cos{\theta}+i\sin{\theta}
$$

`$$\log_{2}\frac{x+1}{x-1}$$`

$$
\log_{2}\frac{x+1}{x-1}
$$

## 6\. Binary Operation/Relation Symbols

---

| Symbol | LaTeX | Symbol | LaTeX |
| --- | --- | --- | --- |
| $\ast$ | `\ast` | $\cap$ | `\cap` |
| $\star$ | `\star` | $\cup$ | `\cup` |
| $\cdot$ | `\cdot` | $\uplus$ | `\uplus` |
| $\circ$ | `\circ` | $\sqcap$ | `\sqcap` |
| $\bullet$ | `\bullet` | $\sqcup$ | `\sqcup` |
| $\bigcirc$ | `\bigcirc` | $\wedge$ | `\wedge` |
| $\diamond$ | `\diamond` | $\vee$ | `\vee` |
| $\times$ | `\times` | $\dagger$ | `\dagger` |
| $\div$ | `\div` | $\ddagger$ | `\ddagger` |
| $\centerdot$ | `\centerdot` | $\barwedge$ | `\barwedge` |
| $\circledast$ | `\circledast` | $\curlywedge$ | `\curlywedge` |
| $\circledcirc$ | `\circledcirc` | $\Cap$ | `\Cap` |
| $\circleddash$ | `\circleddash` | $\bot$ | `\bot` |
| $\dotplus$ | `\dotplus` | $\intercal$ | `\intercal` |
| $\divideontimes$ | `\divideontimes` | $\doublebarwedge$ | `\doublebarwedge` |
| $\equiv$ | `\equiv` | $\geq$ | `\geq` |
| $\cong$ | `\cong` | $\succ$ | `\succ` |
| $\neq$ | `\neq` | $\succeq$ | `\succeq` |
| $\sim$ | `\sim` | $\gg$ | `\gg` |
| $\simeq$ | `\simeq` | $\supset$ | `\supset` |
| $\approx$ | `\approx` | $\supseteq$ | `\supseteq` |
| $\asymp$ | `\asymp` | $\sqsupset$ | `\sqsupset` |
| $\doteq$ | `\doteq` | $\sqsupseteq$ | `\sqsupseteq` |
| $\propto$ | `\propto` | $\vdash$ | `\vdash` |
| $\models$ | `\models` | $\ni$ | `\ni` |
| $\approxeq$ | `\approxeq` | $\geqq$ | `\geqq` |
| $\thicksim$ | `\thicksim` | $\geqslant$ | `\geqslant` |
| $\backsim$ | `\backsim` | $\gtrapprox$ | `\gtrapprox` |
| $\backsimeq$ | `\backsimeq` | $\ggg$ | `\ggg` |
| $\triangleq$ | `\triangleq` | $\gtrdot$ | `\gtrdot` |
| $\circeq$ | `\circeq` | $\gtrsim$ | `\gtrsim` |
| $\bumpeq$ | `\bumpeq` | $\eqslantgtr$ | `\eqslantgtr` |
| $\Bumpeq$ | `\Bumpeq` | $\succsim$ | `\succsim` |
| $\doteqdot$ | `\doteqdot` | $\succapprox$ | `\succapprox` |
| $\thickapprox$ | `\thickapprox` | $\Supset$ | `\Supset` |
| $\fallingdotseq$ | `\fallingdotseq` | $\supseteqq$ | `\supseteqq` |
| $\risingdotseq$ | `\risingdotseq` | $\sqsupset$ | `\sqsupset` |
| $\varpropto$ | `\varpropto` | $\succcurlyeq$ | `\succcurlyeq` |
| $\therefore$ | `\therefore` | $\curlyeqsucc$ | `\curlyeqsucc` |
| $\because$ | `\because` | $\blacktriangleright$ | `\blacktriangleright` |
| $\eqcirc$ | `\eqcirc` | $\trianglerighteq$ | `\trianglerighteq` |
| $\neq$ | `\neq` | $\vartriangleright$ | `\vartriangleright` |
| $\ncong$ | `\ncong` | $\ngeq$ | `\ngeq` |
| $\nmid$ | `\nmid` | $\ngeqq$ | `\ngeqq` |
| $\nparallel$ | `\nparallel` | $\ngeqslant$ | `\ngeqslant` |
| $\nshortmid$ | `\nshortmid` | $\ngtr$ | `\ngtr` |
| $\nshortparallel$ | `\nshortparallel` | $\nsucc$ | `\nsucc` |
| $\nsim$ | `\nsim` | $\nsucceq$ | `\nsucceq` |
| $\nVDash$ | `\nVDash` | $\succnapprox$ | `\succnapprox` |
| $\nvDash$ | `\nvDash` | $\succnsim$ | `\succnsim` |
| $\nvdash$ | `\nvdash` | $\gnapprox$ | `\gnapprox` |
| $\ntriangleleft$ | `\ntriangleleft` | $\gneq$ | `\gneq` |
| $\ntrianglelefteq$ | `\ntrianglelefteq` | $\gneqq$ | `\gneqq` |
| $\ntriangleright$ | `\ntriangleright` | $\gnsim$ | `\gnsim` |
| $\ntrianglerighteq$ | `\ntrianglerighteq` | $\gvertneqq$ | `\gvertneqq` |
| $\pm$ | `\pm` | $\lhd$ | `\lhd` |
| $\mp$ | `\mp` | $\rhd$ | `\rhd` |
| $\amalg$ | `\amalg` | $\triangleleft$ | `\triangleleft` |
| $\odot$ | `\odot` | $\triangleright$ | `\triangleright` |
| $\ominus$ | `\ominus` | $\unlhd$ | `\unlhd` |
| $\oplus$ | `\oplus` | $\unrhd$ | `\unrhd` |
| $\oslash$ | `\oslash` | $\bigtriangledown$ | `\bigtriangledown` |
| $\otimes$ | `\otimes` | $\bigtriangleup$ | `\bigtriangleup` |
| $\wr$ | `\wr` | $\setminus$ | `\setminus` |
| $\Box$ | `\Box` | $\veebar$ | `\veebar` |
| $\boxplus$ | `\boxplus` | $\curlyvee$ | `\curlyvee` |
| $\boxminus$ | `\boxminus` | $\Cup$ | `\Cup` |
| $\boxtimes$ | `\boxtimes` | $\top$ | `\top` |
| $\boxdot$ | `\boxdot` | $\rightthreetimes$ | `\rightthreetimes` |
| $\square$ | `\square` | $\leftthreetimes$ | `\leftthreetimes` |
| $\leq$ | `\leq` | $\perp$ | `\perp` |
| $\prec$ | `\prec` | $\mid$ | `\mid` |
| $\preceq$ | `\preceq` | $\parallel$ | `\parallel` |
| $\ll$ | `\ll` | $\bowtie$ | `\bowtie` |
| $\subset$ | `\subset` | $\Join$ | `\Join` |
| $\subseteq$ | `\subseteq` | $\ltimes$ | `\ltimes` |
| $\sqsubset$ | `\sqsubset` | $\rtimes$ | `\rtimes` |
| $\sqsubseteq$ | `\sqsubseteq` | $\smile$ | `\smile` |
| $\dashv$ | `\dashv` | $\frown$ | `\frown` |
| $\in$ | `\in` | $\notin$ | `\notin` |
| $\leqq$ | `\leqq` | $\lessgtr$ | `\lessgtr` |
| $\leqslant$ | `\leqslant` | $\lesseqgtr$ | `\lesseqgtr` |
| $\lessapprox$ | `\lessapprox` | $\lesseqqgtr$ | `\lesseqqgtr` |
| $\lll$ | `\lll` | $\gtreqqless$ | `\gtreqqless` |
| $\lessdot$ | `\lessdot` | $\gtreqless$ | `\gtreqless` |
| $\lesssim$ | `\lesssim` | $\gtrless$ | `\gtrless` |
| $\eqslantless$ | `\eqslantless` | $\backepsilon$ | `\backepsilon` |
| $\precsim$ | `\precsim` | $\between$ | `\between` |
| $\precapprox$ | `\precapprox` | $\pitchfork$ | `\pitchfork` |
| $\Subset$ | `\Subset` | $\shortmid$ | `\shortmid` |
| $\subseteqq$ | `\subseteqq` | $\smallfrown$ | `\smallfrown` |
| $\sqsubset$ | `\sqsubset` | $\smallsmile$ | `\smallsmile` |
| $\preccurlyeq$ | `\preccurlyeq` | $\Vdash$ | `\Vdash` |
| $\curlyeqprec$ | `\curlyeqprec` | $\vDash$ | `\vDash` |
| $\blacktriangleleft$ | `\blacktriangleleft` | $\Vvdash$ | `\Vvdash` |
| $\trianglelefteq$ | `\trianglelefteq` | $\shortparallel$ | `\shortparallel` |
| $\vartriangleleft$ | `\vartriangleleft` | $\nshortparallel$ | `\nshortparallel` |
| $\nleq$ | `\nleq` | $\nsubseteq$ | `\nsubseteq` |
| $\nleqq$ | `\nleqq` | $\nsupseteq$ | `\nsupseteq` |
| $\nleqslant$ | `\nleqslant` | $\nsubseteqq$ | `\nsubseteqq` |
| $\nless$ | `\nless` | $\nsupseteqq$ | `\nsupseteqq` |
| $\nprec$ | `\nprec` | $\subsetneq$ | `\subsetneq` |
| $\npreceq$ | `\npreceq` | $\supsetneq$ | `\supsetneq` |
| $\precnapprox$ | `\precnapprox` | $\subsetneqq$ | `\subsetneqq` |
| $\precnsim$ | `\precnsim` | $\supsetneqq$ | `\supsetneqq` |
| $\lnapprox$ | `\lnapprox` | $\varsubsetneq$ | `\varsubsetneq` |
| $\lneq$ | `\lneq` | $\varsupsetneq$ | `\varsupsetneq` |
| $\lneqq$ | `\lneqq` | $\varsubsetneqq$ | `\varsubsetneqq` |
| $\lnsim$ | `\lnsim` | $\varsupsetneqq$ | `\varsupsetneqq` |
| $\lvertneqq$ | `\lvertneqq` |  |  |

### Example

`$$x=\pm 2$$`

$$
x=\pm 2
$$

`$$A \oplus B=B \oplus A$$`

$$
A \oplus B=B \oplus A
$$

## 7\. Arrow Symbols

---

| Symbol | LaTeX | Symbol | LaTeX |
| --- | --- | --- | --- |
| $\leftarrow$ | `\leftarrow` | $\dashleftarrow$ | `\dashleftarrow` |
| $\Leftarrow$ | `\Leftarrow` | $\Lleftarrow$ | `\Lleftarrow` |
| $\rightarrow$ | `\rightarrow` | $\looparrowleft$ | `\looparrowleft` |
| $\Rightarrow$ | `\Rightarrow` | $\circlearrowleft$ | `\circlearrowleft` |
| $\leftrightarrow$ | `\leftrightarrow` | $\upharpoonleft$ | `\upharpoonleft` |
| $\Leftrightarrow$ | `\Leftrightarrow` | $\leftrightsquigarrow$ | `\leftrightsquigarrow` |
| $\mapsto$ | `\mapsto` | $\rightrightarrows$ | `\rightrightarrows` |
| $\hookleftarrow$ | `\hookleftarrow` | $\rightarrowtail$ | `\rightarrowtail` |
| $\leftharpoonup$ | `\leftharpoonup` | $\curvearrowright$ | `\curvearrowright` |
| $\leftharpoondown$ | `\leftharpoondown` | $\downdownarrows$ | `\downdownarrows` |
| $\rightleftharpoons$ | `\rightleftharpoons` | $\rightsquigarrow$ | `\sqsubset` |
| $\dashrightarrow$ | `\dashrightarrow` | $\nrightarrow$ | `\nrightarrow` |
| $\leftrightarrows$ | `\leftrightarrows` | $\nleftrightarrow$ | `\nleftrightarrow` |
| $\leftarrowtail$ | `\leftarrowtail` | $\uparrow$ | `\uparrow` |
| $\curvearrowleft$ | `\curvearrowleft` | $\Uparrow$ | `\Uparrow` |
| $\upuparrows$ | `\upuparrows` | $\downarrow$ | `\downarrow` |
| $\multimap$ | `\multimap` | $\Downarrow$ | `\Downarrow` |
| $\rightleftarrows$ | `\rightleftarrows` | $\updownarrow$ | `\updownarrow` |
| $\twoheadrightarrow$ | `\twoheadrightarrow` | $\Updownarrow$ | `\Updownarrow` |
| $\rightleftharpoons$ | `\rightleftharpoons` | $\nearrow$ | `\nearrow` |
| $\Rsh$ | `\Rsh` | $\searrow$ | `\searrow` |
| $\downharpoonright$ | `\downharpoonright` | $\swarrow$ | `\swarrow` |
| $\nleftarrow$ | `\nleftarrow` | $\nwarrow$ | `\nwarrow` |
| $\nRightarrow$ | `\nRightarrow` | $\leftleftarrows$ | `\leftleftarrows` |
| $\longleftarrow$ | `\longleftarrow` | $\twoheadleftarrow$ | `\twoheadleftarrow` |
| $\Longleftarrow$ | `\Longleftarrow` | $\leftrightharpoons$ | `\leftrightharpoons` |
| $\longrightarrow$ | `\longrightarrow` | $\Lsh$ | `\Lsh` |
| $\Longrightarrow$ | `\Longrightarrow` | $\downharpoonleft$ | `\downharpoonleft` |
| $\longleftrightarrow$ | `\longleftrightarrow` | $\rightrightarrows$ | `\rightrightarrows` |
| $\Longleftrightarrow$ | `\Longleftrightarrow` | $\rightleftarrows$ | `\rightleftarrows` |
| $\longmapsto$ | `\longmapsto` | $\looparrowright$ | `\looparrowright` |
| $\hookrightarrow$ | `\hookrightarrow` | $\circlearrowright$ | `\circlearrowright` |
| $\rightharpoonup$ | `\rightharpoonup` | $\upharpoonright$ | `\upharpoonright` |
| $\rightharpoondown$ | `\rightharpoondown` | $\nLeftarrow$ | `\nLeftarrow` |
| $\leadsto$ | `\leadsto` | $\nLeftrightarrow$ | `\nLeftrightarrow` |

### Example

`$$\phi :E \longrightarrow E^{\prime}$$`

$$
\phi :E \longrightarrow E^{\prime}
$$

## 8\. Miscellaneous Symbols

---

| Symbol | LaTeX | Symbol | LaTeX |
| --- | --- | --- | --- |
| $\infty$ | `\infty` | $\Bbbk$ | `\Bbbk` |
| $\nabla$ | `\nabla` | $\bigstar$ | `\bigstar` |
| $\partial$ | `\partial` | $\diagdown$ | `\diagdown` |
| $\eth$ | `\eth` | $\diagup$ | `\diagup` |
| $\clubsuit$ | `\clubsuit` | $\Diamond$ | `\Diamond` |
| $\diamondsuit$ | `\diamondsuit` | $\Finv$ | `\Finv` |
| $\heartsuit$ | `\heartsuit` | $\Game$ | `\Game` |
| $\spadesuit$ | `\spadesuit` | $\hbar$ | `\hbar` |
| $\cdots$ | `\cdots` | $\hslash$ | `\hslash` |
| $\vdots$ | `\vdots` | $\lozenge$ | `\lozenge` |
| $\ldots$ | `\ldots` | $\mho$ | `\mho` |
| $\ddots$ | `\ddots` | $\prime$ | `\prime` |
| $\Im$ | `\Im` | $\square$ | `\square` |
| $\Re$ | `\Re` | $\surd$ | `\surd` |
| $\forall$ | `\forall` | $\wp$ | `\wp` |
| $\exists$ | `\exists` | $\angle$ | `\angle` |
| $\nexists$ | `\nexists` | $\measuredangle$ | `\measuredangle` |
| $\emptyset$ | `\emptyset` | $\sphericalangle$ | `\sphericalangle` |
| $\varnothing$ | `\varnothing` | $\complement$ | `\complement` |
| $\imath$ | `\imath` | $\triangledown$ | `\triangledown` |
| $\jmath$ | `\jmath` | $\triangle$ | `\triangle` |
| $\ell$ | `\ell` | $\vartriangle$ | `\vartriangle` |
| $\iiiint$ | `\iiiint` | $\blacklozenge$ | `\blacklozenge` |
| $\iiint$ | `\iiint` | $\blacksquare$ | `\blacksquare` |
| $\iint$ | `\iint` | $\blacktriangle$ | `\blacktriangle` |
| $\sharp$ | `\sharp` | $\blacktriangledown$ | `\blacktriangledown` |
| $\flat$ | `\flat` | $\backprime$ | `\backprime` |
| $\natural$ | `\natural` | $\circledS$ | `\circledS` |

### Example

`$$x=\infty$$`

$$
x=\infty
$$

## 9\. Math Mode Accents

---

| Symbol | LaTeX | Symbol | LaTeX |
| --- | --- | --- | --- |
| $\acute{a}$ | `\acute{a}` | $\acute{\acute{A}}$ | `\acute{\acute{A}}` |
| $\breve{a}$ | `\breve{a}` | $\breve{\breve{A}}$ | `\breve{\breve{A}}` |
| $\ddot{a}$ | `\ddot{a}` | $\ddot{\ddot{A}}$ | `\ddot{\ddot{A}}` |
| $\grave{a}$ | `\grave{a}` | $\grave{\grave{A}}$ | `\grave{\grave{A}}` |
| $\tilde{a}$ | `\tilde{a}` | $\tilde{\tilde{A}}$ | `\tilde{\tilde{A}}` |
| $\bar{a}$ | `\bar{a}` | $\bar{\bar{A}}$ | `\bar{\bar{A}}` |
| $\check{a}$ | `\check{a}` | $\check{\check{A}}$ | `\check{\check{A}}` |
| $\dot{a}$ | `\dot{a}` | $\dot{\dot{A}}$ | `\dot{\dot{A}}` |
| $\hat{a}$ | `\hat{a}` | $\hat{\hat{A}}$ | `\hat{\hat{A}}` |
| $\vec{a}$ | `\vec{a}` | $\vec{\vec{A}}$ | `\vec{\vec{A}}` |

### Example

`$$\vec{AC}=\vec{AB}+\vec{BC}$$`

$$
\vec{AC}=\vec{AB}+\vec{BC}
$$

## 10\. Matrix

---

| Symbol | LaTeX |
| --- | --- |
| $\begin{matrix}1&2&3\\a&b&c\end{matrix}$ | `\begin{matrix}1&2&3\\a&b&c\end{matrix}` |
| $\begin{pmatrix}1&2&3\\a&b&c\end{pmatrix}$ | `\begin{pmatrix}1&2&3\\a&b&c\end{pmatrix}` |
| $\begin{bmatrix}1&2&3\\a&b&c\end{bmatrix}$ | `\begin{bmatrix}1&2&3\\a&b&c\end{bmatrix}` |
| $\begin{Bmatrix}1&2&3\\a&b&c\end{Bmatrix}$ | `\begin{Bmatrix}1&2&3\\a&b&c\end{Bmatrix}` |
| $\begin{vmatrix}1&2&3\\a&b&c\end{vmatrix}$ | `\begin{vmatrix}1&2&3\\a&b&c\end{vmatrix}` |
| $\begin{Vmatrix}1&2&3\\a&b&c\end{Vmatrix}$ | `\begin{Vmatrix}1&2&3\\a&b&c\end{Vmatrix}` |

### Example

Custom matrix can be created together with the plain matrix.

`$$\left\langle\begin{matrix}1&2&3\\a&b&c\end{matrix}\right\rangle$$`

$$
\left\langle\begin{matrix}1&2&3\\a&b&c\end{matrix}\right\rangle
$$

## 12\. Other Styles

---

Math Mode only.

### Caligraphic Letters

> LaTeX: `$$\mathcal{}$$`

$$
\mathcal{A\ B\ C\ D\ E\ F\ G\ H\ I\ J\ K\ L\ M\ N\ O\ P\ Q\ R\ S\ T\ U\ V\ W\ X\ Y\ Z}
$$

 

$$
\mathcal{a\ b\ c\ d\ e\ f\ g\ h\ i\ j\ k\ l\ m\ n\ o\ p\ q\ r\ s\ t\ u\ v\ w\ x\ y\ z}
$$

### MathBB Letters

> LaTeX: `$$\mathbb{}$$`

$$
\mathbb{A\ B\ C\ D\ E\ F\ G\ H\ I\ J\ K\ L\ M\ N\ O\ P\ Q\ R\ S\ T\ U\ V\ W\ X\ Y\ Z}
$$

 

$$
\mathbb{a\ b\ c\ d\ e\ f\ g\ h\ i\ j\ k\ l\ m\ n\ o\ p\ q\ r\ s\ t\ u\ v\ w\ x\ y\ z}
$$

### MathFrak Letters

> LaTeX: `$$\mathfrak{}$$`

$$
\mathfrak{A\ B\ C\ D\ E\ F\ G\ H\ I\ J\ K\ L\ M\ N\ O\ P\ Q\ R\ S\ T\ U\ V\ W\ X\ Y\ Z}
$$

 

$$
\mathfrak{a\ b\ c\ d\ e\ f\ g\ h\ i\ j\ k\ l\ m\ n\ o\ p\ q\ r\ s\ t\ u\ v\ w\ x\ y\ z}
$$

### Math Sans Serif Letters

> LaTeX: `$$\mathsf{}$$`

$$
\mathsf{A\ B\ C\ D\ E\ F\ G\ H\ I\ J\ K\ L\ M\ N\ O\ P\ Q\ R\ S\ T\ U\ V\ W\ X\ Y\ Z}
$$

 

$$
\mathsf{a\ b\ c\ d\ e\ f\ g\ h\ i\ j\ k\ l\ m\ n\ o\ p\ q\ r\ s\ t\ u\ v\ w\ x\ y\ z}
$$

### Math Bold Letters

> LaTeX: `$$\mathbf{}$$`

$$
\mathbf{A\ B\ C\ D\ E\ F\ G\ H\ I\ J\ K\ L\ M\ N\ O\ P\ Q\ R\ S\ T\ U\ V\ W\ X\ Y\ Z}
$$

 

$$
\mathbf{a\ b\ c\ d\ e\ f\ g\ h\ i\ j\ k\ l\ m\ n\ o\ p\ q\ r\ s\ t\ u\ v\ w\ x\ y\ z}
$$

### Math Bold Italic Letters

> LaTeX: `$$\mathbi{}$$` $\def\mathbi{}$
> 
> Define `$$\def\mathbi{}$$` before using.

$$
\mathbi{A\ B\ C\ D\ E\ F\ G\ H\ I\ J\ K\ L\ M\ N\ O\ P\ Q\ R\ S\ T\ U\ V\ W\ X\ Y\ Z}
$$

 

$$
\mathbi{a\ b\ c\ d\ e\ f\ g\ h\ i\ j\ k\ l\ m\ n\ o\ p\ q\ r\ s\ t\ u\ v\ w\ x\ y\ z}
$$

## References

---

1.  [https://oeis.org/wiki/List\_of\_LaTeX\_mathematical\_symbols](https://oeis.org/wiki/List_of_LaTeX_mathematical_symbols)
2.  [https://www.cmor-faculty.rice.edu/~heinken/latex/symbols.pdf](https://www.cmor-faculty.rice.edu/~heinken/latex/symbols.pdf)
3.  [https://www.overleaf.com/learn/latex/Integrals%2C\_sums\_and\_limits](https://www.overleaf.com/learn/latex/Integrals%2C_sums_and_limits)
