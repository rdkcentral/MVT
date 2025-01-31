#!/bin/bash
echo -e "Content-Type: application/x-tar"
echo -e "Content-Disposition: attachment; filename=test-materials.tar.gz"
echo ""
tar -czf - -C /home/MVT test-materials

