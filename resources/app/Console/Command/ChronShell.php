<?php

// /home/decisiv1/public_html/ryex/app/Console/cake chron >> /home/decisiv1/public_html/ryex/app/Console/chron.log

class ChronShell extends AppShell {
  public $uses = array('Skirmcache');
  public function main() {
    //$this->loadModel('Skirmcache');
    $myFile = "/home/decisiv1/public_html/ryex/app/Console/Chron.log";
    $fh = fopen($myFile, 'a') or die("can't open file");
    $stringData = "This is a test\n";
    fwrite($fh, $stringData);
    fclose($fh);
    $this->out('Hello world.', 1, Shell::VERBOSE);
    $this->Skirmcache->doCleanup();
  }
}
?>