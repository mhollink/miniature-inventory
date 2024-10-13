<?php

namespace App\services\paints;

class PaintAlreadyInStorageException extends \Exception
{
    public function __construct(string $message)
    {
        parent::__construct($message);
    }
}