<p float="center" align="left"><h1><image src="./src/lariattmp.png" width=32px /> </image> Lariat</h1></p>


Welcome to Lariat! A toolkit for architectural chromatin analysis.
			<!-- <li>...</li> -->
<h2>DOCUMENTATION</h2>

<ul>
<!--   <li><a href="#alink_query">QUERY</a></li>
  <li><a href="#alink_inspect">INSPECT</a></li>
  <li><a href="#INSERT_YOUR_OBJECT_NAME_HERE">VIEWER</a></li>
  <li><a href="#INSERT_YOUR_OBJECT_NAME_HERE">PAIRS</a></li>
  <li><a href="#INSERT_YOUR_OBJECT_NAME_HERE">DUMP</a></li> -->
</ul>

-[`QUERY`](#use-of-query)
-[`INSPECT`](#use-of-inspect)
-[`VIEWER`](#use-of-viewer)
-[`PAIR`](#use-of-pair)



The overall goal of Lariat is to provide a tool for anyone to easily perform rapid visualization and analysis of chromatin conformation capture results


  Use of the tools relies on the user to have formed a sqlite3 database compatible for use with Larait via strainer, which can be found on github: [https://github.com/seanpatrickmoran/Lariat](https://github.com/seanpatrickmoran/strainer). Briefly, users will need to provide Ingest with original chomratin conformation capture (3C) data-inputs such as .hic or .cool .mcool files. The user will also need a secondary file that contains chromatin architectural information in tabular form. With both of these, ingestion queries and writes the image data and the data's metadata into a relational database that Lariat can access easily.
  <br>
  <br>
Lariat is a convinient combination of tools to visualize, compare, and filter chromatin architectural features, built specifically with chromatin loops in mind. The easiest way to use Lariat is to populate its clipboard by exploring filter options under PAIRS and then finding shared loops or exclusive loops, and then exporting the records using DUMP.

<br>
<hr>

<!-- <b><a id="#alink_query">QUERY: Access Database Using Known Keys.</a></b> -->
### Use of QUERY
QUERY: Access Database Using Known Keys.

The Query function allows the user to perform read functions on the SQL database linked to Lariat. Query is also useful if the database's contents are not well understood or if the user seeks to combine data from many experiments from publically availible 3C-type data. By default, the database entries are written in exactly the same way via Ingest to the following schema:

  <pre>
       imag(name, 
            dataset, 
            condition, 
            coordinates, 
            numpyarr, 
            viewing_vmax, 
            dimensions, 
            hic_path, 
            PUB_ID, 
            resolution, 
            meta)</pre>

  <p class="main-document">
  Lariat supports simplistic calling to the underlying SQLite database. SQL queries rely on the user
  entering a text input and using the input to check the column names for that input. The column name
  is specified by the "Choose Field" tag, and submits a query like so:
  </p>

  <pre>
  'SELECT * FROM imag WHERE (FIELD) = (?)';
  </pre>

  <p class="main-document">
  In this case (FIELD) would be substituted with whatever field the user chooses, and (?) would be the
   text input.
  </p>

<hr>

### Use of INSPECT
Visualize and process architectural features.

<p>The Inspect function works by issuing a lookup on the existing datasets in the database, depending on the 3C  data-source-path as the keyname for the stored data. The keyname is only a String-value written at the time of	logging the data with Ingest. It is not necessary for the keyname to point to a real location reachable on the user computer running Lariat.</p>

<p float="center" align="middle">
<img class="main-document" src="img/inspect_tutor.png" width=360px>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img class="main-document" src="img/inspect_tutor2.png" width=360px>
</p>

<p>
To inspect data, select a dataset using the drop-down menu under data-set, and then highlight a corresponding
name of an feature entry belonging to the dataset's keyname. Finally, press inspect, this will pre-populate some
of the information in the filter-settings above the image, visualize the image, and give a description of the
image below.
</p>


<p class="main-document">
<u>The vMax or Viewing Maximum</u> is a normalization constant used to determine pixel intensity threshold to make
chromatin features visible. By alittle clever image processing thanks to Ingest, we populate this field with
a vMax number, but the user will be able to change this value to better see chromatin features.<br>
</p>

<p class="main-document">
<u>Normalization</u> is the method of normalization used to prepare the image for viewing. This was determined by Ingest
but may also be changed here between Linear, Log Normalization, and Quantile Normalization.<br>
</p>

<p class="main-document">
<u>More Parameters</u> There's more!<br>
</p>

<hr>

### Use of VIEWER

<p class="main-document">
...
</p>

<p class="main-document">
<u>More Parameters</u> There's more!<br>
</p>

<hr>

### Use of PAIR

<p class="main-document">
...
</p>

<p class="main-document">
<u>More Parameters</u> There's more!<br>
</p>

<hr>

<ul><li><a id="#alink_dump">Dump: Access Database Using Known Keys.</a></li></ul>
<p class="main-document">
...
</p>

<p class="main-document">
<u>More Parameters</u> There's more!<br>
</p>

	</div>
</body>
