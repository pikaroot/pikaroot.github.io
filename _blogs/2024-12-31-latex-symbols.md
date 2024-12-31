---
title: "LaTeX Symbols"
---
List of LaTeX. Wrap `$$\yourlatex$$` around your code.

# 1. Greek and Hebrew Letters
---

| ------- | ----- | ------- | ----- |
|$$\alpha$$|`\alpha`|$$\Phi$$, $$\phi$$ and $$\varphi$$|`\Phi`, `\phi` and `\varphi`|
|$$\beta$$|`\beta`|$$\Pi$$, $$\pi$$ and $$\varpi$$|`\Pi`, `\pi` and `\varpi`|
|$$\chi$$|`\chi`|$$\Psi$$ and $$\psi$$|`\Psi` and `\psi`|
|$$\Delta$$ and $$\delta$$|`\Delta` and `\delta`|$$\rho$$ and $$\varrho$$|`\rho` and `\varrho`|
|$$\epsilon$$ and $$\varepsilon$$|`\epsilon` and `\varepsilon`|$$\Sigma$$, $$\sigma$$ and $$\varsigma$$|`\Sigma`, `\sigma` and `\varsigma`|
|$$\Gamma$$ and $$\gamma$$|`\Gamma` and `\gamma`|$$\tau$$|`\tau`|
|$$\eta$$|`\eta`|$$\Theta$$, $$\theta$$ and $$\vartheta$$|`\Theta`, `\theta` and `\vartheta`|
|$$\iota$$|`\iota`|$$\Upsilon$$ and $$\upsilon$$|`\Upsilon` and `\upsilon`|
|$$\kappa$$ and $$\varkappa$$|`\kappa` and `\varkappa`|$$\Xi$$ and $$\xi$$|`\Xi` and `\xi`|
|$$\Lambda$$ and $$\lambda$$|`\Lambda` and `\lambda`|$$\zeta$$|`\zeta`|
|$$\mu$$|`\mu`|$$\aleph$$|`\aleph`|
|$$\nu$$|`\nu`|$$\beth$$|`\beth`|
|$$\omicron$$|`\omicron`|$$\daleth$$|`\daleth`|
|$$\Omega$$ and $$\omega$$|`\Omega` and `\omega`|$$\gimel$$|`\gimel`|

## Example

`$$P(\alpha,\beta)$$`

$$P(\alpha,\beta)$$ 

# 2. LaTeX Math Constructs
---

| ------- | ----- || ------- | ----- |
|$$\frac{abc}{xyz}$$|`\frac{abc}{xyz}`||$$\widehat{abc}$$|`\widehat{abc}`|
|$$f^{\prime}$$|`f’` or `f^{\prime}`||$$\widetilde{abc}$$|`\widetilde{abc}`|
|$$\sqrt{abc}$$|`\sqrt{abc}`||$$\overrightarrow{abc}$$|`\overrightarrow{abc}`|
|$$\sqrt[n]{abc}$$|`\sqrt[n]{abc}`||$$\overleftarrow{abc}$$|`\overleftarrow{abc}`|
|$$\overline{abc}$$|`\overline{abc}`||$$\overbrace{abc}$$|`\overbrace{abc}`|
|$$\underline{abc}$$|`\underline{abc}`||$$\underbrace{abc}$$|`\underbrace{abc}`|

## Example

`$$2\frac{4x+1}{y-2}$$`

$$2\frac{4x+1}{y-2}$$ 

`$$[\underbrace{1,2,3,\cdots,p-1}_{\text{p-1 elements}}]$$`

$$[\underbrace{1,2,3,\cdots,p-1}_{\text{p-1 elements}}]$$ 

# 3. Delimeters
---

|---|---|---|---|---|---|---|---|---|---|
|$$\vert$$|`|` or `\vert`|$$/$$|`/`|$$\Uparrow$$|`\Uparrow`|$$\lfloor$$|`\lfloor`|$$\llcorner$$|`llcorner`|
|$$\Vert$$|`\|` or `\Vert`|$$\backslash$$|`\backslash`|$$\uparrow$$|`\uparrow`|$$\rfloor$$|`\rfloor`|$$\lrcorner$$|`lrcorner`|
|$$\{$$|`\{`|$$[$$|`[`|$$\Downarrow$$|`\Downarrow`|$$\lceil$$|`\lceil`|$$\ulcorner$$|`\ulcorner`|
|$$\}$$|`\}`|$$]$$|`]`|$$\downarrow$$|`\downarrow`|$$\rceil$$|`\rceil`|$$\urcorner$$|`\urcorner`|
|$$\langle$$|`\langle`|
|$$\rangle$$|`\rangle`|

## Example

`$$|\psi\rangle =\frac{1}{\sqrt{2}}|0\rang +|1\rangle$$`

$$\vert\psi\rangle =\frac{1}{\sqrt{2}} (\vert0\rangle + \vert1\rangle)$$ 

`$$\lfloor\frac{q}{2}\rceil$$`

$$\lfloor\frac{q}{2}\rceil$$ 

# 4. Variable-sized Symbols
---

| ------- | ----- | ------- | ----- | ------- | ----- |
|$$\sum$$|`\sum`|$$\iint$$|`\iint`|$$\bigoplus$$|`\bigoplus`|
|$$\prod$$|`\prod`|$$\biguplus$$|`\biguplus`|$$\bigotimes$$|`\biguplus`|
|$$\coprod$$|`\coprod`|$$\bigcap$$|`\bigcap`|$$\bigodot$$|`bigodot`|
|$$\int$$|`\int`|$$\bigcup$$|`\bigcup`|$$\bigvee$$|`\bigvee`|
|$$\oint$$|`\oint`|$$\bigsqcup$$|`bigsqcup`|$$\bigwedge$$|`\bigwedge`|

## Example

`$$\sum_{n=1}^{\infty} 2^{-n} = 1$$`

$$\sum_{n=1}^{\infty} 2^{-n} = 1$$

`$$\prod_{i=a}^{b} f(i)$$`

$$\prod_{i=a}^{b} f(i)$$ 

# 5. Standard Function Names
---

| ------- | ----- | ------- | ----- | ------- | ----- | ------- | ----- |
|$$\sin$$|`\sin`|$$\sinh$$|`\sinh`|$$\arcsin$$|`\arcsin`|$$\arg$$|`\arg`|
|$$\cos$$|`\cos`|$$\cosh$$|`\cosh`|$$\arccos$$|`\arccos`|$$\deg$$|`\deg`|
|$$\tan$$|`\tan`|$$\tanh$$|`\tanh`|$$\arctan$$|`\arctan`|$$\det$$|`\det`|
|$$\cot$$|`\cot`|$$\coth$$|`\coth`|$$\bmod$$|`\bmod`|$$\dim$$|`\dim`|
|$$\sec$$|`\sec`|$$\lg$$|`\lg`|$$\lim$$|`\lim`|$$\exp$$|`\exp`|
|$$\csc$$|`\csc`|$$\log$$|`\log`|$$\liminf$$|`\liminf`|$$\gcd$$|`\gcd`|
|$$\min$$|`\min`|$$\ln$$|`\ln`|$$\limsup$$|`\limsup`|$$\hom$$|`\hom`|
|$$\max$$|`\max`|$$\ker$$|`\ker`|$$\inf$$|`\inf`|$$\Pr$$|`\Pr`|
|$$\sup$$|`\sup`|||||||

## Example

`$$e^{i\theta}=\cos{\theta}+i\sin{\theta}$$`

$$e^{i\theta}=\cos{\theta}+i\sin{\theta}$$

`$$\log_{2}\frac{x+1}{x-1}$$`

$$\log_{2}\frac{x+1}{x-1}$$

# 6. Binary Operation/Relation Symbols
---

|------|-----|------|-----|------|-----|------|-----|------|-----|
|$$\ast$$|`\ast`|$$\pm$$|`\pm`|$$\cap$$|`\cap`|$$\lhd$$|`\lhd`|
|$$\star$$|`\star`|$$\mp$$|`\mp`|$$\cup$$|`\cup`|$$\rhd$$|`\rhd`|
|$$\cdot$$|`\cdot`|$$\amalg$$|`\amalg`|$$\uplus$$|`\uplus`|$$\triangleleft$$|`\triangleleft`
|$$\circ$$|`\circ`|$$\odot$$|`\odot`|$$\sqcap$$|`\sqcap`|$$\triangleright$$|`\triangleright`|
|$$\bullet$$|`\bullet`|$$\ominus$$|`\ominus`|$$\sqcup$$|`\sqcup`|$$\unlhd$$|`\unlhd`|
|$$\bigcirc$$|`\bigcirc`|$$\oplus$$|`\oplus`|$$\wedge$$|`\wedge`|$$\unrhd$$|`\unrhd`|
|$$\diamond$$|`\diamond`|$$\oslash$$|`\oslash`|$$\vee$$|`\vee`|$$\bigtriangledown$$|`\bigtriangledown`|
|$$\times$$|`\times`|$$\otimes$$|`\otimes`|$$\dagger$$|`\dagger`|$$\bigtriangleup$$|`\bigtriangleup`|
|$$\div$$|`\div`|$$\wr$$|`\wr`|$$\ddagger$$|`\ddagger`|$$\setminus$$|`\setminus`|
|$$\centerdot$$|`\centerdot`|$$\Box$$|`\Box`|$$\barwedge$$|`\barwedge`|$$\veebar$$|`\veebar`|
|$$\circledast$$|`\circledast`|$$\boxplus$$|`\boxplus`|$$\curlywedge$$|`\curlywedge`|$$\curlyvee$$|`\curlyvee`|
|$$\circledcirc$$|`\circledcirc`|$$\boxminus$$|`\boxminus`|$$\Cap$$|`\Cap`|$$\Cup$$|`\Cup`|
|$$\circleddash$$|`\circleddash`|$$\boxtimes$$|`\boxtimes`|$$\bot$$|`\bot`|$$\top$$|`\top`|
|$$\dotplus$$|`\dotplus`|$$\boxdot$$|`\boxdot`|$$\intercal$$|`\intercal`|$$\rightthreetimes$$|`\rightthreetimes`|
|$$\divideontimes$$|`\divideontimes`|$$\square$$|`\square`|$$\doublebarwedge$$|`\doublebarwedge`|$$\leftthreetimes$$|`\leftthreetimes`|
|$$\equiv$$|`\equiv`|$$\leq$$|`\leq`|$$\geq$$|`\geq`|$$\perp$$|`\perp`|
|$$\cong$$|`\cong`|$$\prec$$|`\prec`|$$\succ$$|`\succ`|$$\mid$$|`\mid`|
|$$\neq$$|`\neq`|$$\preceq$$|`\preceq`|$$\succeq$$|`\succeq`|$$\parallel$$|`\parallel`|
|$$\sim$$|`\sim`|$$\ll$$|`\ll`|$$\gg$$|`\gg`|$$\bowtie$$|`\bowtie`|
|$$\simeq$$|`\simeq`|$$\subset$$|`\subset`|$$\supset$$|`\supset`|$$\Join$$|`\Join`|
|$$\approx$$|`\approx`|$$\subseteq$$|`\subseteq`|$$\supseteq$$|`\supseteq`|$$\ltimes$$|`\ltimes`|
|$$\asymp$$|`\asymp`|$$\sqsubset$$|`\sqsubset`|$$\sqsupset$$|`\sqsupset`|$$\rtimes$$|`\rtimes`|
|$$\doteq$$|`\doteq`|$$\sqsubseteq$$|`\sqsubseteq`|$$\sqsupseteq$$|`\sqsupseteq`|$$\smile$$|`\smile`|
|$$\propto$$|`\propto`|$$\dashv$$|`\dashv`|$$\vdash$$|`\vdash`|$$\frown$$|`\frown`|
|$$\models$$|`\models`|$$\in$$|`\in`|$$\ni$$|`\ni`|$$\notin$$|`\notin`|
|$$\approxeq$$|`\approxeq`|$$\leqq$$|`\leqq`|$$\geqq$$|`\geqq`|$$\lessgtr$$|`\lessgtr`|
|$$\thicksim$$|`\thicksim`|$$\leqslant$$|`\leqslant`|$$\geqslant$$|`\geqslant`|$$\lesseqgtr$$|`\lesseqgtr`|
|$$\backsim$$|`\backsim`|$$\lessapprox$$|`\lessapprox`|$$\gtrapprox$$|`\gtrapprox`|$$\lesseqqgtr$$|`\lesseqqgtr`
|$$\backsimeq$$|`\backsimeq`|$$\lll$$|`\lll`|$$\ggg$$|`\ggg`|$$\gtreqqless$$|`\gtreqqless`|
|$$\triangleq$$|`\triangleq`|$$\lessdot$$|`\lessdot`|$$\gtrdot$$|`\gtrdot`|$$\gtreqless$$|`\gtreqless`|
|$$\circeq$$|`\circeq`|$$\lesssim$$|`\lesssim`|$$\gtrsim$$|`\gtrsim`|$$\gtrless$$|`\gtrless`|
|$$\bumpeq$$|`\bumpeq`|$$\eqslantless$$|`\eqslantless`|$$\eqslantgtr$$|`\eqslantgtr`|$$\backepsilon$$|`\backepsilon`|
|$$\Bumpeq$$|`\Bumpeq`|$$\precsim$$|`\precsim`|$$\succsim$$|`\succsim`|$$\between$$|`\between`|
|$$\doteqdot$$|`\doteqdot`|$$\precapprox$$|`\precapprox`|$$\succapprox$$|`\succapprox`|$$\pitchfork$$|`\pitchfork`|
|$$\thickapprox$$|`\thickapprox`|$$\Subset$$|`\Subset`|$$\Supset$$|`\Supset`|$$\shortmid$$|`\shortmid`|
|$$\fallingdotseq$$|`\fallingdotseq`|$$\subseteqq$$|`\subseteqq`|$$\supseteqq$$|`\supseteqq`|$$\smallfrown$$|`\smallfrown`|
|$$\risingdotseq$$|`\risingdotseq`|$$\sqsubset$$|`\sqsubset`|$$\sqsupset$$|`\sqsupset`|$$\smallsmile$$|`\smallsmile`|
|$$\varpropto$$|`\varpropto`|$$\preccurlyeq$$|`\preccurlyeq`|$$\succcurlyeq$$|`\succcurlyeq`|$$\Vdash$$|`\Vdash`|
|$$\therefore$$|`\therefore`|$$\curlyeqprec$$|`\curlyeqprec`|$$\curlyeqsucc$$|`\curlyeqsucc`|$$\vDash$$|`\vDash`|
|$$\because$$|`\because`|$$\blacktriangleleft$$|`\blacktriangleleft`|$$\blacktriangleright$$|`\blacktriangleright`|$$\Vvdash$$|`\Vvdash`|
|$$\eqcirc$$|`\eqcirc`|$$\trianglelefteq$$|`\trianglelefteq`|$$\trianglerighteq$$|`\trianglerighteq`|$$\shortparallel$$|`\shortparallel`|
|$$\neq$$|`\neq`|$$\vartriangleleft$$|`\vartriangleleft`|$$\vartriangleright$$|`\vartriangleright`|$$\nshortparallel$$|`\nshortparallel`|
|$$\ncong$$|`\ncong`|$$\nleq$$|`\nleq`|$$\ngeq$$|`\ngeq`|$$\nsubseteq$$|`\nsubseteq`|
|$$\nmid$$|`\nmid`|$$\nleqq$$|`\nleqq`|$$\ngeqq$$|`\ngeqq`|$$\nsupseteq$$|`\nsupseteq`|
|$$\nparallel$$|`\nparallel`|$$\nleqslant$$|`\nleqslant`|$$\ngeqslant$$|`\ngeqslant`|$$\nsubseteqq$$|`\nsubseteqq`
|$$\nshortmid$$|`\nshortmid`|$$\nless$$|`\nless`|$$\ngtr$$|`\ngtr`|$$\nsupseteqq$$|`\nsupseteqq`|
|$$\nshortparallel$$|`\nshortparallel`|$$\nprec$$|`\nprec`|$$\nsucc$$|`\nsucc`|$$\subsetneq$$|`\subsetneq`|
|$$\nsim$$|`\nsim`|$$\npreceq$$|`\npreceq`|$$\nsucceq$$|`\nsucceq`|$$\supsetneq$$|`\supsetneq`|
|$$\nVDash$$|`\nVDash`|$$\precnapprox$$|`\precnapprox`|$$\succnapprox$$|`\succnapprox`|$$\subsetneqq$$|`\subsetneqq`|
|$$\nvDash$$|`\nvDash`|$$\precnsim$$|`\precnsim`|$$\succnsim$$|`\succnsim`|$$\supsetneqq$$|`\supsetneqq`|
|$$\nvdash$$|`\nvdash`|$$\lnapprox$$|`\lnapprox`|$$\gnapprox$$|`\gnapprox`|$$\varsubsetneq$$|`\varsubsetneq`|
|$$\ntriangleleft$$|`\ntriangleleft`|$$\lneq$$|`\lneq`|$$\gneq$$|`\gneq`|$$\varsupsetneq$$|`\varsupsetneq`|
|$$\ntrianglelefteq$$|`\ntrianglelefteq`|$$\lneqq$$|`\lneqq`|$$\gneqq$$|`\gneqq`|$$\varsubsetneqq$$|`\varsubsetneqq`|
|$$\ntriangleright$$|`\ntriangleright`|$$\lnsim$$|`\lnsim`|$$\gnsim$$|`\gnsim`|$$\varsupsetneqq$$|`\varsupsetneqq`|
|$$\ntrianglerighteq$$|`\ntrianglerighteq`|$$\lvertneqq$$|`\lvertneqq`|$$\gvertneqq$$|`\gvertneqq`|||


## Example

`$$x=\pm 2$$`

$$x=\pm 2$$

`$$A \oplus B=B \oplus A$$`

$$A \oplus B=B \oplus A$$

# 7. Arrow Symbols
---

|------|-----|------|-----|------|-----|
|$$\leftarrow$$|`\leftarrow`|$$\longleftarrow$$|`\longleftarrow`|$$\uparrow$$|`\uparrow`|
|$$\Leftarrow$$|`\Leftarrow`|$$\Longleftarrow$$|`\Longleftarrow`|$$\Uparrow$$|`\Uparrow`|
|$$\rightarrow$$|`\rightarrow`|$$\longrightarrow$$|`\longrightarrow`|$$\downarrow$$|`\downarrow`|
|$$\Rightarrow$$|`\Rightarrow`|$$\Longrightarrow$$|`\Longrightarrow`|$$\Downarrow$$|`\Downarrow`|
|$$\leftrightarrow$$|`\leftrightarrow`|$$\longleftrightarrow$$|`\longleftrightarrow`|$$\updownarrow$$|`\updownarrow`|
|$$\Leftrightarrow$$|`\Leftrightarrow`|$$\Longleftrightarrow$$|`\Longleftrightarrow`|$$\Updownarrow$$|`\Updownarrow`|
|$$\mapsto$$|`\mapsto`|$$\longmapsto$$|`\longmapsto`|$$\nearrow$$|`\nearrow`|
|$$\hookleftarrow$$|`\hookleftarrow`|$$\hookrightarrow$$|`\hookrightarrow`|$$\searrow$$|`\searrow`|
|$$\leftharpoonup$$|`\leftharpoonup`|$$\rightharpoonup$$|`\rightharpoonup`|$$\swarrow$$|`\swarrow`|
|$$\leftharpoondown$$|`\leftharpoondown`|$$\rightharpoondown$$|`\rightharpoondown`|$$\nwarrow$$|`\nwarrow`|
|$$\rightleftharpoons$$|`\rightleftharpoons`|$$\leadsto$$|`\leadsto`|||
|$$\dashrightarrow$$|`\dashrightarrow`|$$\dashleftarrow$$|`\dashleftarrow`|$$\leftleftarrows$$|`\leftleftarrows`|
|$$\leftrightarrows$$|`\leftrightarrows`|$$\Lleftarrow$$|`\Lleftarrow`|$$\twoheadleftarrow$$|`\twoheadleftarrow`|
|$$\leftarrowtail$$|`\leftarrowtail`|$$\looparrowleft$$|`\looparrowleft`|$$\leftrightharpoons$$|`\leftrightharpoons`|
|$$\curvearrowleft$$|`\curvearrowleft`|$$\circlearrowleft$$|`\circlearrowleft`|$$\Lsh$$|`\Lsh`|
|$$\upuparrows$$|`\upuparrows`|$$\upharpoonleft$$|`\upharpoonleft`|$$\downharpoonleft$$|`\downharpoonleft`|
|$$\multimap$$|`\multimap`|$$\leftrightsquigarrow$$|`\leftrightsquigarrow`|$$\rightrightarrows$$|`\rightrightarrows`|
|$$\rightleftarrows$$|`\rightleftarrows`|$$\rightrightarrows$$|`\rightrightarrows`|$$\rightleftarrows$$|`\rightleftarrows`|
|$$\twoheadrightarrow$$|`\twoheadrightarrow`|$$\rightarrowtail$$|`\rightarrowtail`|$$\looparrowright$$|`\looparrowright`|
|$$\rightleftharpoons$$|`\rightleftharpoons`|$$\curvearrowright$$|`\curvearrowright`|$$\circlearrowright$$|`\circlearrowright`|
|$$\Rsh$$|`\Rsh`|$$\downdownarrows$$|`\downdownarrows`|$$\upharpoonright$$|`\upharpoonright`|
|$$\downharpoonright$$|`\downharpoonright`|$$\rightsquigarrow$$|`\sqsubset`|||
|$$\nleftarrow$$|`\nleftarrow`|$$\nrightarrow$$|`\nrightarrow`|$$\nLeftarrow$$|`\nLeftarrow`|
|$$\nRightarrow$$|`\nRightarrow`|$$\nleftrightarrow$$|`\nleftrightarrow`|$$\nLeftrightarrow$$|`\nLeftrightarrow`|

## Example

`$$\phi :E \longrightarrow E^{\prime}$$`

$$\phi :E \longrightarrow E^{\prime}$$

# 8. Miscellaneous Symbols
---

|------|-----|------|-----|------|-----|------|-----|
|$$\infty$$|`\infty`|$$\forall$$|`\forall`|$$\Bbbk$$|`\Bbbk`|$$\wp$$|`\wp`|
|$$\nabla$$|`\nabla`|$$\exists$$|`\exists`|$$\bigstar$$|`\bigstar`|$$\angle$$|`\angle`|
|$$\partial$$|`\partial`|$$\nexists$$|`\nexists`|$$\diagdown$$|`\diagdown`|$$\measuredangle$$|`\measuredangle`
|$$\eth$$|`\eth`|$$\emptyset$$|`\emptyset`|$$\diagup$$|`\diagup`|$$\sphericalangle$$|`\sphericalangle`|
|$$\clubsuit$$|`\clubsuit`|$$\varnothing$$|`\varnothing`|$$\Diamond$$|`\Diamond`|$$\complement$$|`\complement`|
|$$\diamondsuit$$|`\diamondsuit`|$$\imath$$|`\imath`|$$\Finv$$|`\Finv`|$$\triangledown$$|`\triangledown`|
|$$\heartsuit$$|`\heartsuit`|$$\jmath$$|`\jmath`|$$\Game$$|`\Game`|$$\triangle$$|`\triangle`|
|$$\spadesuit$$|`\spadesuit`|$$\ell$$|`\ell`|$$\hbar$$|`\hbar`|$$\vartriangle$$|`\vartriangle`|
|$$\cdots$$|`\cdots`|$$\iiiint$$|`\iiiint`|$$\hslash$$|`\hslash`|$$\blacklozenge$$|`\blacklozenge`|
|$$\vdots$$|`\vdots`|$$\iiint$$|`\iiint`|$$\lozenge$$|`\lozenge`|$$\blacksquare$$|`\blacksquare`|
|$$\ldots$$|`\ldots`|$$\iint$$|`\iint`|$$\mho$$|`\mho`|$$\blacktriangle$$|`\blacktriangle`|
|$$\ddots$$|`\ddots`|$$\sharp$$|`\sharp`|$$\prime$$|`\prime`|$$\blacktriangledown$$|`\blacktriangledown`|
|$$\Im$$|`\Im`|$$\flat$$|`\flat`|$$\square$$|`\square`|$$\backprime$$|`\backprime`|
|$$\Re$$|`\Re`|$$\natural$$|`\natural`|$$\surd$$|`\surd`|$$\circledS$$|`\circledS`|

## Example

`$$x=\infty$$`

$$x=\infty$$

# 9. Math Mode Accents
---

|------|-----|------|-----|------|-----|------|-----|
|$$\acute{a}$$|`\acute{a}`|$$\bar{a}$$|`\bar{a}`|$$\acute{\acute{A}}$$|`\acute{\acute{A}}`|$$\bar{\bar{A}}$$|`\bar{\bar{A}}`|
|$$\breve{a}$$|`\breve{a}`|$$\check{a}$$|`\check{a}`|$$\breve{\breve{A}}$$|`\breve{\breve{A}}`|$$\check{\check{A}}$$|`\check{\check{A}}`|
|$$\ddot{a}$$|`\ddot{a}`|$$\dot{a}$$|`\dot{a}`|$$\ddot{\ddot{A}}$$|`\ddot{\ddot{A}}`|$$\dot{\dot{A}}$$|`\dot{\dot{A}}`
|$$\grave{a}$$|`\grave{a}`|$$\hat{a}$$|`\hat{a}`|$$\grave{\grave{A}}$$|`\grave{\grave{A}}`|$$\hat{\hat{A}}$$|`\hat{\hat{A}}`|
|$$\tilde{a}$$|`\tilde{a}`|$$\vec{a}$$|`\vec{a}`|$$\tilde{\tilde{A}}$$|`\tilde{\tilde{A}}`|$$\vec{\vec{A}}$$|`\vec{\vec{A}}`|

## Example

`$$\vec{AC}=\vec{AB}+\vec{BC}$$`

$$\vec{AC}=\vec{AB}+\vec{BC}$$

# 10. Matrix
---

|---|---|
|$$\begin{matrix}1&2&3\\a&b&c\end{matrix}$$|`\begin{matrix}1&2&3\\a&b&c\end{matrix}`|
|$$\begin{pmatrix}1&2&3\\a&b&c\end{pmatrix}$$|`\begin{pmatrix}1&2&3\\a&b&c\end{pmatrix}`|
|$$\begin{bmatrix}1&2&3\\a&b&c\end{bmatrix}$$|`\begin{bmatrix}1&2&3\\a&b&c\end{bmatrix}`|
|$$\begin{Bmatrix}1&2&3\\a&b&c\end{Bmatrix}$$|`\begin{Bmatrix}1&2&3\\a&b&c\end{Bmatrix}`|
|$$\begin{vmatrix}1&2&3\\a&b&c\end{vmatrix}$$|`\begin{vmatrix}1&2&3\\a&b&c\end{vmatrix}`|
|$$\begin{Vmatrix}1&2&3\\a&b&c\end{Vmatrix}$$|`\begin{Vmatrix}1&2&3\\a&b&c\end{Vmatrix}`|


## Example

Custom matrix can be created together with the plain matrix.

`$$\left\langle\begin{matrix}1&2&3\\a&b&c\end{matrix}\right\rangle$$`

$$\left\langle\begin{matrix}1&2&3\\a&b&c\end{matrix}\right\rvert$$

# 12. Other Styles
---

Math Mode only.

## Caligraphic Letters

>LaTeX: `$$\mathcal{}$$`

$$\mathcal{A\ B\ C\ D\ E\ F\ G\ H\ I\ J\ K\ L\ M\ N\ O\ P\ Q\ R\ S\ T\ U\ V\ W\ X\ Y\ Z}$$

$$\mathcal{a\ b\ c\ d\ e\ f\ g\ h\ i\ j\ k\ l\ m\ n\ o\ p\ q\ r\ s\ t\ u\ v\ w\ x\ y\ z}$$

## MathBB Letters

>LaTeX: `$$\mathbb{}$$`

$$\mathbb{A\ B\ C\ D\ E\ F\ G\ H\ I\ J\ K\ L\ M\ N\ O\ P\ Q\ R\ S\ T\ U\ V\ W\ X\ Y\ Z}$$

$$\mathbb{a\ b\ c\ d\ e\ f\ g\ h\ i\ j\ k\ l\ m\ n\ o\ p\ q\ r\ s\ t\ u\ v\ w\ x\ y\ z}$$

## MathFrak Letters

>LaTeX: `$$\mathfrak{}$$`

$$\mathfrak{A\ B\ C\ D\ E\ F\ G\ H\ I\ J\ K\ L\ M\ N\ O\ P\ Q\ R\ S\ T\ U\ V\ W\ X\ Y\ Z}$$

$$\mathfrak{a\ b\ c\ d\ e\ f\ g\ h\ i\ j\ k\ l\ m\ n\ o\ p\ q\ r\ s\ t\ u\ v\ w\ x\ y\ z}$$

## Math Sans Serif Letters

>LaTeX: `$$\mathsf{}$$`

$$\mathsf{A\ B\ C\ D\ E\ F\ G\ H\ I\ J\ K\ L\ M\ N\ O\ P\ Q\ R\ S\ T\ U\ V\ W\ X\ Y\ Z}$$

$$\mathsf{a\ b\ c\ d\ e\ f\ g\ h\ i\ j\ k\ l\ m\ n\ o\ p\ q\ r\ s\ t\ u\ v\ w\ x\ y\ z}$$

## Math Bold Letters

>LaTeX: `$$\mathbf{}$$`

$$\mathbf{A\ B\ C\ D\ E\ F\ G\ H\ I\ J\ K\ L\ M\ N\ O\ P\ Q\ R\ S\ T\ U\ V\ W\ X\ Y\ Z}$$

$$\mathbf{a\ b\ c\ d\ e\ f\ g\ h\ i\ j\ k\ l\ m\ n\ o\ p\ q\ r\ s\ t\ u\ v\ w\ x\ y\ z}$$

## Math Bold Italic Letters

>LaTeX: `$$\mathbi{}$$` $$\def\mathbi{}$$
>
>Define `$$\def\mathbi{}$$` before using.

$$\mathbi{A\ B\ C\ D\ E\ F\ G\ H\ I\ J\ K\ L\ M\ N\ O\ P\ Q\ R\ S\ T\ U\ V\ W\ X\ Y\ Z}$$

$$\mathbi{a\ b\ c\ d\ e\ f\ g\ h\ i\ j\ k\ l\ m\ n\ o\ p\ q\ r\ s\ t\ u\ v\ w\ x\ y\ z}$$

# References
---

1. [https://oeis.org/wiki/List_of_LaTeX_mathematical_symbols](https://oeis.org/wiki/List_of_LaTeX_mathematical_symbols)
2. [https://www.cmor-faculty.rice.edu/~heinken/latex/symbols.pdf](https://www.cmor-faculty.rice.edu/~heinken/latex/symbols.pdf)
3. [https://www.overleaf.com/learn/latex/Integrals%2C_sums_and_limits](https://www.overleaf.com/learn/latex/Integrals%2C_sums_and_limits)
