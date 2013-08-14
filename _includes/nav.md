<li {% if include.cur == 'docs' %} class="active" {% endif %}><a href="{{ include.dir }}#">Documentation</a></li>
<li {% if include.tag == 'example' %} class="active" {% endif %}><a href="{{ include.dir }}blog/tagged/example.html">Examples</a></li>
<li {% if include.cur == 'blog' %} class="active" {% endif %}><a href="{{ include.dir }}blog/">Blog</a></li>