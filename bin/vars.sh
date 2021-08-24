
readonly PREFIX=$(echo $PWD | awk -F/ '{print $(NF-1)"_"$(NF)}')
export PREFIX
