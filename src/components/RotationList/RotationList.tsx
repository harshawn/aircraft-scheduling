import { DragEvent, FC, useEffect, useState } from "react";
import {
  ArrowCircleRightOutlined,
  Flight,
  RemoveCircle,
} from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Grid,
  Box,
  Alert,
  Typography,
  IconButton,
} from "@mui/material";

import { IRotation } from "../../interfaces/IFlights";
import { validateRotations } from "../../utils/validateRotations";

interface IRotationList {
  rotations: IRotation[];
  onChange: (updatedRotations: IRotation[]) => void;
  handleRemove: (id: string) => void;
}

interface IDragAndDrop {
  draggedFrom: number | null;
  draggedTo: number | null;
  isDragging: boolean;
  originalOrder: IRotation[];
  updatedOrder: IRotation[];
}

export const RotationList: FC<IRotationList> = ({
  rotations,
  onChange,
  handleRemove,
}) => {
  const initialDragAndDrop: IDragAndDrop = {
    draggedFrom: null,
    draggedTo: null,
    isDragging: false,
    originalOrder: [],
    updatedOrder: [],
  };

  const [list, setList] = useState<IRotation[]>(rotations);
  const [dragAndDrop, setDragAndDrop] =
    useState<IDragAndDrop>(initialDragAndDrop);

  // onDragStart fires when a rotation starts being dragged
  const onDragStart = (event: DragEvent<HTMLLIElement>) => {
    const initialPosition = Number(event.currentTarget.dataset.position);

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: initialPosition,
      isDragging: true,
      originalOrder: list,
    });

    // this enables drag events on mobile
    event.dataTransfer.setData("text/html", "");
  };

  // onDragOver fires when a rotation being dragged enters a droppable area
  const onDragOver = (event: DragEvent<HTMLLIElement>) => {
    event.preventDefault();

    let newList = dragAndDrop.originalOrder;

    // index of the rotation being dragged (set to 0 when undefined draggedFrom)
    const draggedFrom = dragAndDrop.draggedFrom ?? 0;

    // index of the droppable area being hovered
    const draggedTo = Number(event.currentTarget.dataset.position);

    const itemDragged = newList[draggedFrom];
    const remainingItems = newList.filter((_, index) => index !== draggedFrom);

    newList = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo),
    ];

    if (draggedTo !== dragAndDrop.draggedTo) {
      setDragAndDrop({
        ...dragAndDrop,
        updatedOrder: newList,
        draggedTo: draggedTo,
      });
    }
  };

  const onDrop = () => {
    setList(dragAndDrop.updatedOrder);

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false,
    });
  };

  const onDragLeave = () => {
    setDragAndDrop({
      ...dragAndDrop,
      draggedTo: null,
    });
  };

  useEffect(() => {
    // updated rotations
    if (dragAndDrop && !dragAndDrop.isDragging) {
      setList(validateRotations(dragAndDrop.updatedOrder));
      onChange(validateRotations(dragAndDrop.updatedOrder));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragAndDrop]);

  useEffect(() => {
    if (rotations.length > 1) {
      setList(validateRotations(rotations));
    } else {
      setList(rotations);
    }
  }, [rotations]);

  return (
    <List>
      {list.map((item, index) => {
        return (
          <ListItem
            sx={{
              p: 0,
              mb: "1rem",
              transform: "translate3d(0, 0, 0)",
              border: "1px solid #c8c8c8",
              borderRadius: "5px",
            }}
            key={index}
            data-position={index}
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={onDragLeave}
          >
            <ListItemButton>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container xs item spacing={2} sx={{ ml: -1 }}>
                  <Grid item xs={6}>
                    <ListItemIcon>
                      <Flight />
                      <Typography
                        variant="subtitle1"
                        sx={{ pl: 1 }}
                      >{`FLIGHT : ${item.id}`}</Typography>
                    </ListItemIcon>
                  </Grid>
                  <Grid item xs={6} sx={{ pt: 1, pb: 1, textAlign: "right" }}>
                    <IconButton
                      sx={{ mr: -1 }}
                      onClick={() => handleRemove(item.id)}
                    >
                      <RemoveCircle />
                    </IconButton>
                  </Grid>

                  <Grid item xs={4} sx={{ mt: -1 }}>
                    <Box>
                      <Typography variant="body1">{item.origin}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1">
                        {item.readable_departure}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "center", mt: -1 }}>
                    <ArrowCircleRightOutlined
                      fontSize="large"
                      sx={{ fill: "#757575" }}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "right", mt: -1 }}>
                    <Box>
                      <Typography variant="body1">
                        {item.destination}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1">
                        {item.readable_arrival}
                      </Typography>
                    </Box>
                  </Grid>

                  {item.errorMessage && item.errorMessage.length > 0 && (
                    <Grid item xs={12} sx={{ mb: 1 }}>
                      <Alert severity="error">
                        <Typography variant="body1">
                          {item.errorMessage.toUpperCase()}
                        </Typography>
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};
